import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import TicketForm from '../components/tickets/TicketForm';
import Button from '../components/common/Button';
import ticketService from '../services/ticketService';

export default function CreateTicket() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const createMutation = useMutation({
    mutationFn: (data) => ticketService.create(data),
    onSuccess: (data) => {
      navigate(`/tickets/${data.id}`, {
        state: { message: 'Ticket created successfully!' }
      });
    },
    onError: (err) => {
      setError(
        err.response?.data?.message ||
        'Failed to create ticket. Please try again.'
      );
    },
  });

  const handleSubmit = (formData) => {
    setError(null);
    createMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <Link to="/tickets" className="hover:text-odpp-blue">
                  Tickets
                </Link>
                <span>/</span>
                <span className="text-gray-900">Create New Ticket</span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Ticket
              </h1>
            </div>
            <Button variant="outline" onClick={() => navigate('/tickets')}>
              Cancel
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Submit a Support Request
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Please provide as much detail as possible about your issue.
                    This will help us resolve your request faster.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error Creating Ticket
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Ticket Details
              </h2>
            </div>
            <div className="px-6 py-6">
              <TicketForm
                onSubmit={handleSubmit}
                loading={createMutation.isPending}
              />
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Need Help?
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • Provide a clear, descriptive title for your issue
              </li>
              <li>
                • Include error messages, screenshots, or steps to reproduce
              </li>
              <li>
                • Specify your location for on-site support requests
              </li>
              <li>
                • Set appropriate priority based on urgency
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
