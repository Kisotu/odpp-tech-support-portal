<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TicketResource;
use App\Models\AuditLog;
use App\Models\Ticket;
use App\Models\TicketAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class TicketController extends Controller
{
    /**
     * Display a listing of tickets.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Ticket::with(["user", "assignedTo"])->orderBy(
            "created_at",
            "desc",
        );

        // Staff can only see their own tickets
        if ($user->role === "staff") {
            $query->where("user_id", $user->id);
        }

        // Apply filters
        if ($request->has("status") && $request->status !== "") {
            $query->where("status", $request->status);
        }

        if ($request->has("category") && $request->category !== "") {
            $query->where("category", $request->category);
        }

        if ($request->has("priority") && $request->priority !== "") {
            $query->where("priority", $request->priority);
        }

        if ($request->has("search") && $request->search !== "") {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where("title", "like", "%{$search}%")
                    ->orWhere("description", "like", "%{$search}%")
                    ->orWhere("ticket_number", "like", "%{$search}%");
            });
        }

        if ($request->has("assigned_to") && $request->assigned_to !== "") {
            $query->where("assigned_to", $request->assigned_to);
        }

        $perPage = max(1, min((int) $request->input("per_page", 15), 100));
        $tickets = $query->paginate($perPage);

        return response()->json([
            "data" => TicketResource::collection($tickets),
            "meta" => [
                "current_page" => $tickets->currentPage(),
                "last_page" => $tickets->lastPage(),
                "per_page" => $tickets->perPage(),
                "total" => $tickets->total(),
            ],
        ]);
    }

    /**
     * Store a newly created ticket.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "title" => "required|string|max:255",
            "description" => "required|string|min:10",
            "category" =>
                "required|in:hardware,software,network,printer,email,account,other",
            "priority" => "required|in:low,medium,high,critical",
        ]);

        $ticket = Ticket::create([
            "user_id" => $request->user()->id,
            "title" => $validated["title"],
            "description" => $validated["description"],
            "category" => $validated["category"],
            "priority" => $validated["priority"],
            "status" => "new",
        ]);

        // Log the creation
        AuditLog::create([
            "ticket_id" => $ticket->id,
            "user_id" => $request->user()->id,
            "action" => "created",
            "field" => null,
            "old_value" => null,
            "new_value" => json_encode($ticket->toArray()),
        ]);

        // Handle file attachments
        if ($request->hasFile("attachments")) {
            foreach ($request->file("attachments") as $file) {
                $this->saveAttachment($ticket, $file, $request);
            }
        }

        $ticket->load(["user", "assignedTo", "attachments"]);

        $this->sendTicketEmail(
            $ticket->user->email,
            "Ticket Created: {$ticket->ticket_number}",
            [
                "Your ticket has been created successfully.",
                "Ticket Number: {$ticket->ticket_number}",
                "Title: {$ticket->title}",
                "Priority: {$ticket->priority}",
                "Status: {$ticket->status}",
            ],
        );

        return response()->json(
            [
                "message" => "Ticket created successfully",
                "data" => new TicketResource($ticket),
            ],
            201,
        );
    }

    /**
     * Display the specified ticket.
     */
    public function show(Request $request, $id)
    {
        $ticket = Ticket::with([
            "user",
            "assignedTo",
            "comments.user",
            "attachments",
        ])->findOrFail($id);

        $user = $request->user();

        // Staff can only view their own tickets
        if ($user->role === "staff" && $ticket->user_id !== $user->id) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        return response()->json([
            "data" => new TicketResource($ticket),
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
            return response()->json(["message" => "Unauthorized"], 403);
        }

        $validated = $request->validate([
            "title" => "sometimes|string|max:255",
            "description" => "sometimes|string|min:10",
            "category" =>
                "sometimes|in:hardware,software,network,printer,email,account,other",
            "priority" => "sometimes|in:low,medium,high,critical",
            "status" => "sometimes|in:new,in_progress,resolved,closed",
        ]);

        $oldStatus = $ticket->status;
        $ticket->update($validated);

        // Log status changes
        if (
            isset($validated["status"]) &&
            $validated["status"] !== $oldStatus
        ) {
            AuditLog::create([
                "ticket_id" => $ticket->id,
                "user_id" => $user->id,
                "action" => "status_changed",
                "field" => "status",
                "old_value" => $oldStatus,
                "new_value" => $validated["status"],
            ]);

            // Update resolved_at timestamp
            if ($validated["status"] === "resolved") {
                $ticket->update(["resolved_at" => now()]);
            }

            // Update closed_at timestamp
            if ($validated["status"] === "closed") {
                $ticket->update(["closed_at" => now()]);
            }
        }

        $ticket->load(["user", "assignedTo", "comments.user", "attachments"]);

        return response()->json([
            "message" => "Ticket updated successfully",
            "data" => new TicketResource($ticket),
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
        if ($user->role !== "admin" && $ticket->user_id !== $user->id) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        // Soft delete
        $ticket->delete();

        AuditLog::create([
            "ticket_id" => $ticket->id,
            "user_id" => $user->id,
            "action" => "deleted",
            "field" => null,
            "old_value" => null,
            "new_value" => null,
        ]);

        return response()->json([
            "message" => "Ticket deleted successfully",
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
        if ($user->role === "staff" && $ticket->user_id !== $user->id) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        $validated = $request->validate([
            "comment" => "required|string|min:1",
            "is_internal" => "sometimes|boolean",
        ]);

        // Staff cannot create internal notes
        $isInternal =
            $user->role === "staff"
                ? false
                : $validated["is_internal"] ?? false;

        $comment = $ticket->comments()->create([
            "user_id" => $user->id,
            "comment" => $validated["comment"],
            "is_internal" => $isInternal,
        ]);

        $comment->load("user");

        return response()->json(
            [
                "message" => "Comment added successfully",
                "data" => $comment,
            ],
            201,
        );
    }

    /**
     * Get comments for a ticket.
     */
    public function getComments(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $user = $request->user();

        // Staff can only view comments on their own tickets
        if ($user->role === "staff" && $ticket->user_id !== $user->id) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        $query = $ticket
            ->comments()
            ->with("user")
            ->orderBy("created_at", "asc");

        // Staff cannot see internal notes
        if ($user->role === "staff") {
            $query->where("is_internal", false);
        }

        $comments = $query->get();

        return response()->json([
            "data" => $comments,
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
        if ($user->role === "staff" && $ticket->user_id !== $user->id) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        $request->validate([
            "file" =>
                "required|file|max:5120|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx,txt,log",
        ]);

        $file = $request->file("file");
        $attachment = $this->saveAttachment($ticket, $file, $request);

        return response()->json(
            [
                "message" => "Attachment uploaded successfully",
                "data" => $attachment,
            ],
            201,
        );
    }

    /**
     * Delete an attachment.
     */
    public function deleteAttachment(Request $request, $ticketId, $attachmentId)
    {
        $ticket = Ticket::findOrFail($ticketId);
        $attachment = TicketAttachment::where("ticket_id", $ticketId)
            ->where("id", $attachmentId)
            ->firstOrFail();

        $user = $request->user();

        // Staff can only delete from their own tickets
        if ($user->role === "staff" && $ticket->user_id !== $user->id) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        Storage::disk("public")->delete($attachment->file_path);
        $attachment->delete();

        return response()->json([
            "message" => "Attachment deleted successfully",
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
        if (!in_array($user->role, ["ict_officer", "admin"])) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        $validated = $request->validate([
            "assigned_to" => [
                "required",
                Rule::exists("users", "id")->where(fn($query) => $query
                    ->where("role", "ict_officer")
                    ->where("is_active", true)),
            ],
        ]);

        $oldAssigned = $ticket->assigned_to;
        $ticket->update([
            "assigned_to" => $validated["assigned_to"],
            "status" => "in_progress",
        ]);

        AuditLog::create([
            "ticket_id" => $ticket->id,
            "user_id" => $user->id,
            "action" => "assigned",
            "field" => "assigned_to",
            "old_value" => $oldAssigned,
            "new_value" => $validated["assigned_to"],
        ]);

        $ticket->load(["user", "assignedTo"]);

        if ($ticket->assignedTo) {
            $this->sendTicketEmail(
                $ticket->assignedTo->email,
                "Ticket Assigned: {$ticket->ticket_number}",
                [
                    "A ticket has been assigned to you.",
                    "Ticket Number: {$ticket->ticket_number}",
                    "Title: {$ticket->title}",
                    "Priority: {$ticket->priority}",
                ],
            );
        }

        if ($ticket->user) {
            $this->sendTicketEmail(
                $ticket->user->email,
                "Ticket Update: {$ticket->ticket_number} Assigned",
                [
                    "Your ticket has been assigned to an ICT officer.",
                    "Ticket Number: {$ticket->ticket_number}",
                    "Title: {$ticket->title}",
                    "Status: {$ticket->status}",
                ],
            );
        }

        return response()->json([
            "message" => "Ticket assigned successfully",
            "data" => new TicketResource($ticket),
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
        return response()->json(["message" => "Unauthorized"], 403);
    }

    $validated = $request->validate([
        "status" => "required|in:new,in_progress,resolved,closed",
        "resolution_notes" => "sometimes|string",
    ]);

    $oldStatus = $ticket->status;
    $newStatus = $validated["status"];

    // Validate status transition
    $transitionError = $this->validateStatusTransition($oldStatus, $newStatus);
    if ($transitionError) {
        return response()->json(["message" => $transitionError], 422);
    }

    $updateData = ["status" => $newStatus];

    if (isset($validated["resolution_notes"])) {
        $updateData["resolution_notes"] = $validated["resolution_notes"];
    }

    if ($newStatus === "resolved") {
        $updateData["resolved_at"] = now();
    }

    if ($newStatus === "closed") {
        $updateData["closed_at"] = now();
    }

    // Clear resolved_at if moving back to in_progress
    if ($oldStatus === "resolved" && $newStatus === "in_progress") {
        $updateData["resolved_at"] = null;
    }

    $ticket->update($updateData);

    AuditLog::create([
        "ticket_id" => $ticket->id,
        "user_id" => $user->id,
        "action" => "status_changed",
        "field" => "status",
        "old_value" => $oldStatus,
        "new_value" => $newStatus,
    ]);

    $ticket->load(["user", "assignedTo"]);

    if ($ticket->user) {
        $this->sendTicketEmail(
            $ticket->user->email,
            "Ticket Status Updated: {$ticket->ticket_number}",
            [
                "Your ticket status has been updated.",
                "Ticket Number: {$ticket->ticket_number}",
                "Title: {$ticket->title}",
                "Old Status: {$oldStatus}",
                "New Status: {$ticket->status}",
            ],
        );
    }

    return response()->json([
        "message" => "Status updated successfully",
        "data" => new TicketResource($ticket),
    ]);
}

/**
 * Reopen a closed or resolved ticket.
 */
public function reopen(Request $request, $id)
{
    $ticket = Ticket::findOrFail($id);
    $user = $request->user();

    // Authorization: Only admin, ict_officer, or ticket owner can reopen
    if ($user->role === "staff" && $ticket->user_id !== $user->id) {
        return response()->json(["message" => "Unauthorized"], 403);
    }

    // Can only reopen resolved or closed tickets
    if (!in_array($ticket->status, ["resolved", "closed"])) {
        return response()->json([
            "message" => "Only resolved or closed tickets can be reopened",
        ], 422);
    }

    $oldStatus = $ticket->status;
    $ticket->update([
        "status" => "in_progress",
        "resolved_at" => null,
        "closed_at" => null,
    ]);

    AuditLog::create([
        "ticket_id" => $ticket->id,
        "user_id" => $user->id,
        "action" => "reopened",
        "field" => "status",
        "old_value" => $oldStatus,
        "new_value" => "in_progress",
    ]);

    if ($ticket->user) {
        $this->sendTicketEmail(
            $ticket->user->email,
            "Ticket Reopened: {$ticket->ticket_number}",
            [
                "Your ticket has been reopened.",
                "Ticket Number: {$ticket->ticket_number}",
                "Title: {$ticket->title}",
                "Previous Status: {$oldStatus}",
                "New Status: in_progress",
            ],
        );
    }

    $ticket->load(["user", "assignedTo"]);

    return response()->json([
        "message" => "Ticket reopened successfully",
        "data" => new TicketResource($ticket),
    ]);
}

/**
 * Validate status transition rules.
 * Returns error message if invalid, null if valid.
 */
private function validateStatusTransition($oldStatus, $newStatus)
{
    // Same status is always valid (no change)
    if ($oldStatus === $newStatus) {
        return null;
    }

    // Define valid transitions
    $validTransitions = [
        "new" => ["in_progress"],
        "in_progress" => ["resolved", "closed"],
        "resolved" => ["closed", "in_progress"], // Can close or reopen
        "closed" => ["in_progress"], // Can only reopen
    ];

    // Admin can bypass transition rules
    // (handled at controller level if needed)

    if (!isset($validTransitions[$oldStatus])) {
        return "Invalid current status";
    }

    if (!in_array($newStatus, $validTransitions[$oldStatus])) {
        $allowed = implode(", ", $validTransitions[$oldStatus]);
        return "Cannot transition from {$oldStatus} to {$newStatus}. Allowed transitions: {$allowed}";
    }

    return null;
}

    /**
     * Helper method to save attachment.
     */
    private function saveAttachment(Ticket $ticket, $file, Request $request)
    {
        $path = $file->store("attachments/{$ticket->id}", "public");

        $attachment = TicketAttachment::create([
            "ticket_id" => $ticket->id,
            "user_id" => $request->user()->id,
            "file_path" => $path,
            "file_name" => $file->getClientOriginalName(),
            "file_size" => $file->getSize(),
            "mime_type" => $file->getMimeType(),
        ]);

        return $attachment;
    }

    /**
     * Check if user can update ticket.
     */
    private function canUpdateTicket($user, $ticket)
    {
        // Admin can update any ticket
        if ($user->role === "admin") {
            return true;
        }

        // ICT officer can update assigned tickets
        if (
            $user->role === "ict_officer" &&
            $ticket->assigned_to === $user->id
        ) {
            return true;
        }

        // Staff can update their own tickets (limited)
        if (
            $user->role === "staff" &&
            $ticket->user_id === $user->id &&
            $ticket->status === "new"
        ) {
            return true;
        }

        return false;
    }

    /**
     * Send basic ticket email notification.
     */
    private function sendTicketEmail(string $to, string $subject, array $lines): void
    {
        try {
            Mail::raw(implode("\n", $lines), function ($message) use ($to, $subject) {
                $message->to($to)->subject($subject);
            });
        } catch (\Throwable $exception) {
            Log::warning("Failed to send ticket email notification", [
                "to" => $to,
                "subject" => $subject,
                "error" => $exception->getMessage(),
            ]);
        }
    }
}
