<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics.
     */
    public function stats(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'staff') {
            return $this->getStaffStats($user);
        }

        return $this->getICTStats($user);
    }

    /**
     * Get statistics for staff users.
     */
    private function getStaffStats($user)
    {
        $tickets = Ticket::where('user_id', $user->id);

        $stats = [
            'total_tickets' => $tickets->count(),
            'new' => (clone $tickets)->where('status', 'new')->count(),
            'in_progress' => (clone $tickets)->where('status', 'in_progress')->count(),
            'resolved' => (clone $tickets)->where('status', 'resolved')->count(),
            'closed' => (clone $tickets)->where('status', 'closed')->count(),
        ];

        // Recent tickets
        $recentTickets = Ticket::where('user_id', $user->id)
            ->with(['assignedTo'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => $stats,
            'recent_tickets' => $recentTickets,
        ]);
    }

    /**
     * Get statistics for ICT officers and admins.
     */
    private function getICTStats($user)
    {
        // Base query for ICT officers (only their assigned tickets)
        $baseQuery = $user->role === 'ict_officer'
            ? Ticket::where('assigned_to', $user->id)
            : new Ticket();

        // Overall ticket counts
        $stats = [
            'total_tickets' => $user->role === 'ict_officer'
                ? $baseQuery->count()
                : Ticket::count(),
            'new' => Ticket::where('status', 'new')->count(),
            'in_progress' => Ticket::where('status', 'in_progress')->count(),
            'resolved' => Ticket::where('status', 'resolved')->count(),
            'closed' => Ticket::where('status', 'closed')->count(),
            'unassigned' => Ticket::whereNull('assigned_to')->count(),
            'my_tickets' => Ticket::where('assigned_to', $user->id)->count(),
        ];

        // Tickets by category
        $byCategory = Ticket::select('category', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->get()
            ->pluck('count', 'category');

        // Tickets by priority
        $byPriority = Ticket::select('priority', DB::raw('count(*) as count'))
            ->groupBy('priority')
            ->get()
            ->pluck('count', 'priority');

        // Average resolution time (in hours) for resolved tickets
        $avgResolutionTime = Ticket::whereNotNull('resolved_at')
            ->whereNotNull('created_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as avg_hours')
            ->first();

        // Recent unassigned tickets
        $recentUnassigned = Ticket::whereNull('assigned_to')
            ->with(['user'])
            ->orderBy('priority', 'desc')
            ->orderBy('created_at', 'asc')
            ->limit(5)
            ->get();

        // Recent assigned to me
        $recentAssigned = Ticket::where('assigned_to', $user->id)
            ->with(['user'])
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => $stats,
            'by_category' => $byCategory,
            'by_priority' => $byPriority,
            'avg_resolution_time' => round($avgResolutionTime->avg_hours ?? 0, 1),
            'recent_unassigned' => $recentUnassigned,
            'recent_assigned' => $recentAssigned,
        ]);
    }

    /**
     * Get tickets by status over time (for charts).
     */
    public function trends(Request $request)
    {
        $user = $request->user();

        // Only ICT officers and admins can view trends
        if (!in_array($user->role, ['ict_officer', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $days = $request->get('days', 30);
        $startDate = now()->subDays($days)->startOfDay();

        $trends = Ticket::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as total'),
                DB::raw("SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_count"),
                DB::raw("SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_count"),
                DB::raw("SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_count"),
                DB::raw("SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_count")
            )
            ->where('created_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'trends' => $trends,
        ]);
    }

    /**
     * Get performance metrics for ICT officers.
     */
    public function performance(Request $request)
    {
        $user = $request->user();

        // Only admins can view all performance metrics
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $ictOfficers = User::where('role', 'ict_officer')->get();

        $performance = $ictOfficers->map(function ($officer) {
            $assigned = Ticket::where('assigned_to', $officer->id);
            $resolved = Ticket::where('assigned_to', $officer->id)
                ->whereNotNull('resolved_at');

            return [
                'id' => $officer->id,
                'name' => $officer->name,
                'email' => $officer->email,
                'total_assigned' => $assigned->count(),
                'total_resolved' => $resolved->count(),
                'in_progress' => $assigned->where('status', 'in_progress')->count(),
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
            'performance' => $performance,
        ]);
    }
}
