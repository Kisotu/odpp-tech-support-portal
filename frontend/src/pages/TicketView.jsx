import { useParams, useNavigate } from 'react-router-dom';
import TicketDetail from '../components/tickets/TicketDetail';

export default function TicketView() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Ticket Details</h1>
            <button
              onClick={() => navigate('/tickets')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Tickets
            </button>
          </div>
        </div>
      </header>
      <main>
        <TicketDetail key={id} />
      </main>
    </div>
  );
}
