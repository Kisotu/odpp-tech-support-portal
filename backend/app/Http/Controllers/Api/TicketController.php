<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TicketResource;
use App\Models\AuditLog;
use App\Models\Ticket;
use App\Models\TicketAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TicketController extends Controller
{
    /**
     * Display a listing of tickets.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Ticket::with(['user', 'assignedTo'])
            ->orderBy('created_at', 'desc');

        // Staff can only see their own tickets
        if ($user->role === 'staff') {
            $query->where('user_id', $user->id);
        }

        // Apply filters
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('category') && $request->category !== '') {
            $query->where('category', $request->category);
        }

        if ($request->has('priority') && $request->priority !== '') {
            $query->where('priority', $request->priority);
        }

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('ticket_number', 'like', "%{$search}%");
            });
        }

        if ($request->has('assigned_to') && $request->assigned_to !== '') {
            $query->where('assigned_to', $request->assigned_to);
        }

        $tickets = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => TicketResource::collection($tickets),
            'meta' => [
                'current_page' => $tickets->currentPage(),
                'last_page' => $tickets->lastPage(),
                'per_page' => $tickets->perPage(),
                'total' => $tickets->total(),
            ],
        ]);
    }

    /**
     * Store a newly created ticket.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:10',
            'category' => 'required|in:hardware,software,network,printer,email,other',
            'priority' => 'required|in:low,medium,high,critical',
        ]);

        $ticket = Ticket::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'priority' => $validated['priority'],
            'status' => 'new',
        ]);

        // Log the creation
        AuditLog::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'action' => 'created',
            'old_value' => null,
            'new_value' => json_encode($ticket->toArray()),
        ]);

        // Handle file attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $this->saveAttachment($ticket, $file);
            }
        }

        $ticket->load(['user', 'assignedTo', 'attachments']);

        return response()->json([
            'message' => 'Ticket created successfully',
            'data' => new TicketResource($ticket),
        ], 201);
    }

    /**
     * Display the specified ticket.
     */
    public function show(Request $request, $id)
    {
        $ticket = Ticket::with(['user', 'assignedTo', 'comments.user', 'attachments'])
            ->findOrFail($id);

        $user = $request->user();

        // Staff can only view their own tickets
        if ($user->role === 'staff' && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'data' => new TicketResource($ticket),
        ]);
    }

    /**
     * Update the specified ticket.
     */
    public function update(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $user = $request->user();

        // Authorization check
        $canUpdate = $this->canUpdateTicket($user, $ticket);
        if (!$canUpdate) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|min:10',
            'category' => 'sometimes|in:hardware,software,network,printer,email,other',
            'priority' => 'sometimes|in:low,medium,high,critical',
            'status' => 'sometimes|in:new,in_progress,resolved,closed',
        ]);

        $oldStatus = $ticket->status;
        $ticket->update($validated);

        // Log status changes
        if (isset($validated['status']) && $validated['status'] !== $oldStatus) {
            AuditLog::create([
                'ticket_id' => $ticket->id,
                'user_id' => $user->id,
                'action' => 'status_changed',
                'old_value' => $oldStatus,
                'new_value' => $validated['status'],
            ]);

            // Update resolved_at timestamp
            if ($validated['status'] === 'resolved') {
                $ticket->update(['resolved_at' => now()]);
            }

            // Update closed_at timestamp
            if ($validated['status'] === 'closed') {
                $ticket->update(['closed_at' => now()]);
            }
        }

        $ticket->load(['user', 'assignedTo', 'comments.user', 'attachments']);

        return response()->json([
            'message' => 'Ticket updated successfully',
            'data' => new TicketResource($ticket),
        ]);
    }

    /**
     * Remove the specified ticket (soft delete).
     */
    public function destroy(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $user = $request->user();

        // Only owner can delete their own tickets, or admin
        if ($user->role !== 'admin' && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Soft delete
        $ticket->delete();

        AuditLog::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'action' => 'deleted',
            'old_value' => null,
            'new_value' => null,
        ]);

        return response()->json([
            'message' => 'Ticket deleted successfully',
        ]);
    }

    /**
     * Add a comment to a ticket.
     */
    public function addComment(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $user = $request->user();

        // Staff can only comment on their own tickets
        if ($user->role === 'staff' && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'comment' => 'required|string|min:1',
            'is_internal' => 'sometimes|boolean',
        ]);

        // Staff cannot create internal notes
        $isInternal = $user->role === 'staff' ? false : ($validated['is_internal'] ?? false);

        $comment = $ticket->comments()->create([
            'user_id' => $user->id,
            'comment' => $validated['comment'],
            'is_internal' => $isInternal,
        ]);

        $comment->load('user');

        return response()->json([
            'message' => 'Comment added successfully',
            'data' => $comment,
        ], 201);
    }

    /**
     * Get comments for a ticket.
     */
    public function getComments(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $user = $request->user();

        // Staff can only view comments on their own tickets
        if ($user->role === 'staff' && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = $ticket->comments()->with('user')->orderBy('created_at', 'asc');

        // Staff cannot see internal notes
        if ($user->role === 'staff') {
            $query->where('is_internal', false);
        }

        $comments = $query->get();

        return response()->json([
            'data' => $comments,
        ]);
    }

    /**
     * Upload attachment to a ticket.
     */
    public function uploadAttachment(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $user = $request->user();

        // Staff can only upload to their own tickets
        if ($user->role === 'staff' && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'file' => 'required|file|max:5120|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx,txt,log',
        ]);

        $file = $request->file('file');
        $attachment = $this->saveAttachment($ticket, $file);

        return response()->json([
            'message' => 'Attachment uploaded successfully',
            'data' => $attachment,
        ], 201);
    }

    /**
     * Delete an attachment.
     */
    public function deleteAttachment(Request $request, $ticketId, $attachmentId)
    {
        $ticket = Ticket::findOrFail($ticketId);
        $attachment = TicketAttachment::where('ticket_id', $ticketId)
            ->where('id', $attachmentId)
            ->firstOrFail();

        $user = $request->user();

        // Staff can only delete from their own tickets
        if ($user->role === 'staff' && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Storage::delete($attachment->file_path);
        $attachment->delete();

        return response()->json([
            'message' => 'Attachment deleted successfully',
        ]);
    }

    /**
     * Assign ticket to an ICT officer.
     */
    public function assign(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $user = $request->user();

        // Only ICT officers and admins can assign tickets
        if (!in_array($user->role, ['ict_officer', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        $oldAssigned = $ticket->assigned_to;
        $ticket->update([
            'assigned_to' => $validated['assigned_to'],
            'status' => 'in_progress',
        ]);

        AuditLog::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'action' => 'assigned',
            'old_value' => $oldAssigned,
            'new_value' => $validated['assigned_to'],
        ]);

        $ticket->load(['user', 'assignedTo']);

        return response()->json([
            'message' => 'Ticket assigned successfully',
            'data' => new TicketResource($ticket),
        ]);
    }

    /**
     * Update ticket status.
     */
    public function updateStatus(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $user = $request->user();

        // Authorization check
        $canUpdate = $this->canUpdateTicket($user, $ticket);
        if (!$canUpdate) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:new,in_progress,resolved,closed',
            'resolution_notes' => 'sometimes|string',
        ]);

        $oldStatus = $ticket->status;
        $updateData = ['status' => $validated['status']];

        if (isset($validated['resolution_notes'])) {
            $updateData['resolution_notes'] = $validated['resolution_notes'];
        }

        if ($validated['status'] === 'resolved') {
            $updateData['resolved_at'] = now();
        }

        if ($validated['status'] === 'closed') {
            $updateData['closed_at'] = now();
        }

        $ticket->update($updateData);

        AuditLog::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'action' => 'status_changed',
            'old_value' => $oldStatus,
            'new_value' => $validated['status'],
        ]);

        $ticket->load(['user', 'assignedTo']);

        return response()->json([
            'message' => 'Status updated successfully',
            'data' => new TicketResource($ticket),
        ]);
    }

    /**
     * Helper method to save attachment.
     */
    private function saveAttachment(Ticket $ticket, $file)
    {
        $path = $file->store("attachments/{$ticket->id}", 'public');

        $attachment = TicketAttachment::create([
            'ticket_id' => $ticket->id,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'file_type' => $file->getMimeType(),
        ]);

        return $attachment;
    }

    /**
     * Check if user can update ticket.
     */
    private function canUpdateTicket($user, $ticket)
    {
        // Admin can update any ticket
        if ($user->role === 'admin') {
            return true;
        }

        // ICT officer can update assigned tickets
        if ($user->role === 'ict_officer' && $ticket->assigned_to === $user->id) {
            return true;
        }

        // Staff can update their own tickets (limited)
        if ($user->role === 'staff' && $ticket->user_id === $user->id && $ticket->status === 'new') {
            return true;
        }

        return false;
    }
}
