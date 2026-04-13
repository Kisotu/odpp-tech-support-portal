import { Link } from "react-router-dom";
import Navigation from "../components/common/Navigation";
import TicketList from "../components/tickets/TicketList";
import Button from "../components/common/Button";

export default function Tickets() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

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
          {/* Ticket List */}
          <TicketList />
        </div>
      </main>
    </div>
  );
}
