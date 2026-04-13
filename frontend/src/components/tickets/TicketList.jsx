import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import TicketFilters from './TicketFilters';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import Spinner from '../common/Spinner';
import ticketService from '../../services/ticketService';

export default function TicketList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: '',
    page: 1,
    per_page: 15,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => ticketService.getAll(filters),
    keepPreviousData: true,
  });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
      search: '',
      page: 1,
      per_page: 15,
    });
  };

  const handleRowClick = (ticket) => {
    navigate(`/tickets/${ticket.id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns = [
    {
      key: 'ticket_number',
      label: 'Ticket #',
      render: (value) => (
        <span className="font-medium text-odpp-blue">{value}</span>
      ),
    },
    {
      key: 'title',
      label: 'Subject',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900 truncate max-w-xs">
            {value}
          </div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {row.description?.substring(0, 50)}...
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => (
        <span className="capitalize">{value?.replace('_', ' ')}</span>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (value) => <PriorityBadge priority={value} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'requester',
      label: 'Requester',
      render: (value) => (
        <span>{value?.name || '-'}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value) => formatDate(value),
    },
    {
      key: 'updated_at',
      label: 'Updated',
      render: (value) => formatDate(value),
    },
  ];

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        Error loading tickets: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TicketFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.tickets?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No tickets found. Create a new ticket to get started.
                      </td>
                    </tr>
                  ) : (
                    data?.tickets?.map((ticket) => (
                      <tr
                        key={ticket.id}
                        onClick={() => handleRowClick(ticket)}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        {columns.map((column) => (
                          <td
                            key={column.key}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            {column.render
                              ? column.render(ticket[column.key], ticket)
                              : ticket[column.key]}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data?.pagination && data.pagination.totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === data.pagination.totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page{' '}
                      <span className="font-medium">{filters.page}</span> of{' '}
                      <span className="font-medium">
                        {data.pagination.totalPages}
                      </span>{' '}
                      <span className="text-gray-500">
                        ({data.pagination.totalItems} total tickets)
                      </span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(filters.page - 1)}
                        disabled={filters.page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="sr-only">Previous</span>
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        {filters.page} / {data.pagination.totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(filters.page + 1)}
                        disabled={filters.page === data.pagination.totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="sr-only">Next</span>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
