import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import ticketService from "../services/ticketService";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import Navigation from "../components/common/Navigation";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => ticketService.getStats(),
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const stats = statsData?.stats || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                  <div className="text-sm font-medium text-gray-500">New</div>
                  <div className="text-3xl font-bold text-blue-600 mt-2">
                    {stats.new || 0}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                  <div className="text-sm font-medium text-gray-500">
                    In Progress
                  </div>
                  <div className="text-3xl font-bold text-yellow-600 mt-2">
                    {stats.in_progress || 0}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                  <div className="text-sm font-medium text-gray-500">
                    Resolved
                  </div>
                  <div className="text-3xl font-bold text-green-600 mt-2">
                    {stats.resolved || 0}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-500">
                  <div className="text-sm font-medium text-gray-500">
                    Closed
                  </div>
                  <div className="text-3xl font-bold text-gray-600 mt-2">
                    {stats.closed || 0}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <Link to="/tickets/create" className="block">
                      <Button variant="primary" className="w-full">
                        + Create New Ticket
                      </Button>
                    </Link>
                    <Link to="/tickets" className="block">
                      <Button variant="outline" className="w-full">
                        View All Tickets
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Your Summary</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Tickets</span>
                      <span className="font-semibold">
                        {stats.total_tickets || 0}
                      </span>
                    </div>
                    {user?.role !== "staff" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Assigned to You</span>
                          <span className="font-semibold">
                            {stats.my_tickets || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Unassigned</span>
                          <span className="font-semibold text-amber-600">
                            {stats.unassigned || 0}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

{/* Info Box */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Welcome to ODPP Tech Support Portal
            </h2>
            <p className="text-gray-600">
              {user?.role === "staff"
                ? "Submit and track your IT support requests from this portal. Click 'Create New Ticket' to report an issue."
                : "Manage and resolve IT support tickets efficiently. Check the unassigned queue to pick up new tickets."}
            </p>
            {(user?.role === "ict_officer" || user?.role === "admin") && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Use the{" "}
                  <Link to="/ict-dashboard" className="font-medium underline">
                    ICT Dashboard
                  </Link>{" "}
                  for queue management and ticket assignment.
                </p>
              </div>
            )}
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Phase 3 Complete!</strong> ICT features including
                ticket assignment, queue management, and status workflow are
                now available.
              </p>
            </div>
          </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
