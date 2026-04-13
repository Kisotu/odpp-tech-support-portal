<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum']);
    }

    public function resolutionTimes(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['ict_officer', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $category = $request->get('category');
        $priority = $request->get('priority');
        $startDate = $request->get('start_date', now()->subDays(30));
        $endDate = $request->get('end_date', now());

        $query = Ticket::whereNotNull('resolved_at')
            ->whereNotNull('created_at')
            ->whereBetween('created_at', [$startDate, $endDate]);

        if ($category) {
            $query->where('category', $category);
        }

        if ($priority) {
            $query->where('priority', $priority);
        }

        $resolutionTimes = $query
            ->select(
                'category',
                DB::raw('AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as avg_hours'),
                DB::raw('MIN(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as min_hours'),
                DB::raw('MAX(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as max_hours'),
                DB::raw('COUNT(*) as ticket_count')
            )
            ->groupBy('category')
            ->get();

        $overall = Ticket::whereNotNull('resolved_at')
            ->whereNotNull('created_at')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as avg_hours')
            ->first();

        return response()->json([
            'by_category' => $resolutionTimes,
            'overall_avg_hours' => round($overall->avg_hours ?? 0, 1),
            'period' => [
                'start' => $startDate,
                'end' => $endDate,
            ],
        ]);
    }

    public function byCategory(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['ict_officer', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $startDate = $request->get('start_date', now()->subDays(30));
        $endDate = $request->get('end_date', now());

        $categories = Ticket::whereBetween('created_at', [$startDate, $endDate])
            ->select(
                'category',
                DB::raw('COUNT(*) as total'),
                DB::raw("SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_count"),
                DB::raw("SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_count"),
                DB::raw("SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_count"),
                DB::raw("SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_count")
            )
            ->groupBy('category')
            ->get();

        $priorityBreakdown = Ticket::whereBetween('created_at', [$startDate, $endDate])
            ->select(
                'category',
                'priority',
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('category', 'priority')
            ->get()
            ->groupBy('category')
            ->map(function ($items) {
                return $items->pluck('count', 'priority');
            });

        return response()->json([
            'by_category' => $categories,
            'priority_breakdown' => $priorityBreakdown,
            'period' => [
                'start' => $startDate,
                'end' => $endDate,
            ],
        ]);
    }

    public function slaCompliance(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['ict_officer', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $slaTargets = [
            'critical' => ['response_hours' => 1, 'resolution_hours' => 4],
            'high' => ['response_hours' => 4, 'resolution_hours' => 24],
            'medium' => ['response_hours' => 24, 'resolution_hours' => 72],
            'low' => ['response_hours' => 48, 'resolution_hours' => 168],
        ];

        $startDate = $request->get('start_date', now()->subDays(30));
        $endDate = $request->get('end_date', now());

        $tickets = Ticket::whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('resolved_at')
            ->get();

        $compliance = [];
        foreach ($slaTargets as $priority => $targets) {
            $priorityTickets = $tickets->where('priority', $priority);
            $total = $priorityTickets->count();

            if ($total === 0) {
                $compliance[$priority] = [
                    'total' => 0,
                    'met' => 0,
                    'breached' => 0,
                    'compliance_rate' => 100.0,
                ];
                continue;
            }

            $met = $priorityTickets->filter(function ($ticket) use ($targets) {
                $resolutionHours = $ticket->created_at->diffInHours($ticket->resolved_at);
                return $resolutionHours <= $targets['resolution_hours'];
            })->count();

            $compliance[$priority] = [
                'total' => $total,
                'met' => $met,
                'breached' => $total - $met,
                'compliance_rate' => round(($met / $total) * 100, 1),
                'sla_target_hours' => $targets['resolution_hours'],
            ];
        }

        $totalTickets = $tickets->count();
        $totalMet = collect($compliance)->sum('met');
        $overallRate = $totalTickets > 0
            ? round(($totalMet / $totalTickets) * 100, 1)
            : 100.0;

        return response()->json([
            'compliance' => $compliance,
            'overall_compliance_rate' => $overallRate,
            'period' => [
                'start' => $startDate,
                'end' => $endDate,
            ],
        ]);
    }

    public function officerWorkload(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $ictOfficers = \App\Models\User::where('role', 'ict_officer')->get();

        $workload = $ictOfficers->map(function ($officer) {
            $assigned = Ticket::where('assigned_to', $officer->id);
            $resolved = Ticket::where('assigned_to', $officer->id)
                ->whereNotNull('resolved_at');

            return [
                'id' => $officer->id,
                'name' => $officer->name,
                'email' => $officer->email,
                'department' => $officer->department,
                'total_assigned' => $assigned->count(),
                'total_resolved' => $resolved->count(),
                'in_progress' => $assigned->where('status', 'in_progress')->count(),
                'new_tickets' => $assigned->where('status', 'new')->count(),
                'avg_resolution_time' => round(
                    Ticket::where('assigned_to', $officer->id)
                        ->whereNotNull('resolved_at')
                        ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as avg_hours')
                        ->first()->avg_hours ?? 0,
                    1
                ),
            ];
        });

        return response()->json([
            'workload' => $workload,
        ]);
    }

    public function exportCsv(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['ict_officer', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $reportType = $request->get('type', 'tickets');

        $tickets = Ticket::with(['user', 'assignedTo'])
            ->orderBy('created_at', 'desc')
            ->limit(1000)
            ->get();

        $csv = "ID,Title,Category,Priority,Status,Created By,Assigned To,Created At,Resolved At,Closed At\n";

        foreach ($tickets as $ticket) {
            $csv .= sprintf(
                "%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
                $ticket->id,
                str_replace('"', '""', $ticket->title),
                $ticket->category,
                $ticket->priority,
                $ticket->status,
                $ticket->user->name ?? 'N/A',
                $ticket->assignedTo->name ?? 'Unassigned',
                $ticket->created_at->format('Y-m-d H:i:s'),
                $ticket->resolved_at?->format('Y-m-d H:i:s') ?? '',
                $ticket->closed_at?->format('Y-m-d H:i:s') ?? ''
            );
        }

        return response()->streamDownload(function () use ($csv) {
            echo $csv;
        }, "tickets_export_" . now()->format('Y-m-d') . ".csv", [
            'Content-Type' => 'text/csv',
        ]);
    }
}