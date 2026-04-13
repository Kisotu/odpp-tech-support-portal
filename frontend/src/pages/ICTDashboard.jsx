import { Link, Navigate, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import ticketService from "../services/ticketService";
import Button from "../components/common/Button";
import Card, { CardHeader, CardTitle, CardBody } from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import Navigation from "../components/common/Navigation";
import { StatusBadge, PriorityBadge } from "../components/common/Badge";

export default function ICTDashboard() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => ticketService.getStats(),
  });

  const { data: queueData, isLoading: queueLoading } = useQuery({
    queryKey: ["ticket-queue"],
    queryFn: () => ticketService.getAll({ status: "new", per_page: 100 }),
    enabled: user?.role === "ict_officer" || user?.role === "admin",
  });

  const { data: myTicketsData, isLoading: myTicketsLoading } = useQuery({
    queryKey: ["my-tickets"],
    queryFn: () => ticketService.getAll({ assigned_to: user?.id, per_page: 10 }),
    enabled: user?.role === "ict_officer" || user?.role === "admin",
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "staff") {
    return <Navigate to="/dashboard" replace />;
  }

  const stats = statsData?.stats || {};
  const queue = queueData?.tickets || [];
  const myTickets = myTicketsData?.tickets || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">ICT Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage support tickets and track performance
            </p>
          </div>

          {statsLoading ? (
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
                  <div className="text-sm font-medium text-gray-500">Closed</div>
                  <div className="text-3xl font-bold text-gray-600 mt-2">
                    {stats.closed || 0}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <Link to="/tickets/create" className="block">
                      <Button variant="primary" className="w-full">
                        + Create New Ticket
                      </Button>
                    </Link>
                    <Link to="/tickets?status=new" className="block">
                      <Button variant="outline" className="w-full">
                        View Unassigned Queue
                      </Button>
                    </Link>
                    <Link to="/tickets" className="block">
                      <Button variant="ghost" className="w-full">
                        View All Tickets
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Your Stats</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Assigned to You</span>
                      <span className="font-semibold text-lg">
                        {stats.my_tickets || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Unassigned</span>
                      <span className="font-semibold text-lg text-amber-600">
                        {stats.unassigned || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Tickets</span>
                      <span className="font-semibold text-lg">
                        {stats.total_tickets || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Performance</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Resolution Rate</span>
                      <span className="font-semibold text-lg text-green-600">
                        {stats.total_tickets > 0
                          ? Math.round(
                              ((stats.resolved || 0) / stats.total_tickets) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Avg. Response</span>
                      <span className="font-semibold text-lg">--</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Unassigned Queue</CardTitle>
                      <Link to="/tickets?status=new">
                        <Button variant="ghost" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardBody>
                    {queueLoading ? (
                      <div className="flex justify-center py-8">
                        <Spinner size="md" />
                      </div>
                    ) : queue.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No unassigned tickets
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {queue.slice(0, 5).map((ticket) => (
                          <div
                            key={ticket.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() =>
                              navigate(`/tickets/${ticket.id}`)
                            }
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  {ticket.ticket_number}
                                </span>
                                <PriorityBadge
                                  priority={ticket.priority}
                                  size="sm"
                                />
                              </div>
                              <p className="text-sm font-medium text-gray-900 truncate mt-1">
                                {ticket.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(ticket.created_at)}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>My Assigned Tickets</CardTitle>
                      <Link to={`/tickets?assigned_to=${user?.id}`}>
                        <Button variant="ghost" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardBody>
                    {myTicketsLoading ? (
                      <div className="flex justify-center py-8">
                        <Spinner size="md" />
                      </div>
                    ) : myTickets.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No assigned tickets
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {myTickets.map((ticket) => (
                          <div
                            key={ticket.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() =>
                              navigate(`/tickets/${ticket.id}`)
                            }
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  {ticket.ticket_number}
                                </span>
                                <StatusBadge status={ticket.status} size="sm" />
                                <PriorityBadge
                                  priority={ticket.priority}
                                  size="sm"
                                />
                              </div>
                              <p className="text-sm font-medium text-gray-900 truncate mt-1">
                                {ticket.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(ticket.created_at)}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}