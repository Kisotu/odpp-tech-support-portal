<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Ticket extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        "user_id",
        "assigned_to",
        "ticket_number",
        "title",
        "description",
        "category",
        "priority",
        "status",
        "resolved_at",
        "closed_at",
        "resolution_notes",
    ];

    protected function casts(): array
    {
        return [
            "resolved_at" => "datetime",
            "closed_at" => "datetime",
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($ticket) {
            if (empty($ticket->ticket_number)) {
                $ticket->ticket_number =
                    "TKT-" . date("Ymd") . "-" . Str::upper(Str::random(6));
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, "assigned_to");
    }

    public function comments()
    {
        return $this->hasMany(TicketComment::class);
    }

    public function attachments()
    {
        return $this->hasMany(TicketAttachment::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function isNew(): bool
    {
        return $this->status === "new";
    }

    public function isInProgress(): bool
    {
        return $this->status === "in_progress";
    }

    public function isResolved(): bool
    {
        return $this->status === "resolved";
    }

    public function isClosed(): bool
    {
        return $this->status === "closed";
    }
}
