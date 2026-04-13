<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ticket_number' => $this->ticket_number,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'priority' => $this->priority,
            'status' => $this->status,
            'resolution_notes' => $this->resolution_notes,
            'resolved_at' => $this->resolved_at?->toISOString(),
            'closed_at' => $this->closed_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'user' => $this->whenLoaded('user', fn() => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'department' => $this->user->department,
            ]),
            'assigned_to' => $this->whenLoaded('assignedTo', fn() => $this->assignedTo ? [
                'id' => $this->assignedTo->id,
                'name' => $this->assignedTo->name,
                'email' => $this->assignedTo->email,
            ] : null),
            'comments' => $this->whenLoaded('comments', fn() => $this->comments->map(fn($comment) => [
                'id' => $comment->id,
                'comment' => $comment->comment,
                'is_internal' => $comment->is_internal,
                'user' => [
                    'id' => $comment->user->id,
                    'name' => $comment->user->name,
                ],
                'created_at' => $comment->created_at->toISOString(),
            ])),
            'attachments' => $this->whenLoaded('attachments', fn() => $this->attachments->map(fn($attachment) => [
                'id' => $attachment->id,
                'file_name' => $attachment->file_name,
                'file_size' => $attachment->file_size,
                'file_type' => $attachment->file_type,
                'url' => asset('storage/' . $attachment->file_path),
            ])),
        ];
    }
}
