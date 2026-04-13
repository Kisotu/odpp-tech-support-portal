import { Link } from "react-router-dom";
import TicketList from "../components/tickets/TicketList";
import Button from "../components/common/Button";
import { useAuthStore } from "../store/authStore";

export default function Tickets() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage and track IT support requests
              </p>
            </div>
            <Link to="/tickets/create">
              <Button variant="primary" className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Ticket
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm font-medium text-gray-500">Open</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">-</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm font-medium text-gray-500">
                In Progress
              </div>
              <div className="text-2xl font-bold text-yellow-600 mt-1">-</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm font-medium text-gray-500">Resolved</div>
              <div className="text-2xl font-bold text-green-600 mt-1">-</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm font-medium text-gray-500">Total</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">-</div>
            </div>
          </div>

          {/* Ticket List */}
          <TicketList />
        </div>
      </main>

      {/* User Info Footer */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-sm text-gray-600">
        <span className="font-medium">{user?.name}</span>
        <span className="mx-2">|</span>
        <span className="capitalize">{user?.role?.replace("_", " ")}</span>
      </div>
    </div>
  );
}
