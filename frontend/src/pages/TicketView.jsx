import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../components/common/Navigation";
import TicketDetail from "../components/tickets/TicketDetail";

export default function TicketView() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-4">
          <button
            onClick={() => navigate("/tickets")}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Tickets
          </button>
        </div>
        <TicketDetail key={id} />
      </main>
    </div>
  );
}
