import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ticketService } from "../../services/ticketService";
import Badge, { StatusBadge, PriorityBadge } from "../common/Badge";
import Button from "../common/Button";
import Card, { CardHeader, CardTitle, CardBody } from "../common/Card";
import Spinner from "../common/Spinner";
import CommentSection from "./CommentSection";

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: ticket,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => ticketService.getById(id),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => ticketService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["ticket", id]);
      setIsEditing(false);
    },
  });

  const handleStatusChange = (newStatus) => {
    updateMutation.mutate({ status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">Error loading ticket</p>
          <p className="text-sm mt-1">{error.message}</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigate("/tickets")}
          >
            Back to Tickets
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <button
            onClick={() => navigate("/tickets")}
            className="hover:text-odpp-blue"
          >
            Tickets
          </button>
          <span>/</span>
          <span>Ticket #{ticket?.ticket_number}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{ticket?.title}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/tickets")}>
              Back to List
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {ticket?.description}
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Attachments */}
          {ticket?.attachments && ticket.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  {ticket.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          />
                        </svg>
                        <span className="text-sm text-gray-700">
                          {attachment.name}
                        </span>
                      </div>
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-odpp-blue hover:underline"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Comments Section */}
          <CommentSection ticketId={id} comments={ticket?.comments || []} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Priority */}
          <Card>
            <CardBody className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </label>
                <div className="mt-2">
                  <StatusBadge status={ticket?.status} size="lg" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </label>
                <div className="mt-2">
                  <PriorityBadge priority={ticket?.priority} size="lg" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </label>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                  {ticket?.category?.replace(/_/g, " ")}
                </p>
              </div>
            </CardBody>
          </Card>

          {/* People */}
          <Card>
            <CardBody className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requester
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {ticket?.requester?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {ticket?.requester?.email}
                </p>
              </div>

              {ticket?.assigned_to && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {ticket?.assigned_to?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ticket?.assigned_to?.email}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Dates */}
          <Card>
            <CardBody className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(ticket?.created_at)}
                </p>
              </div>

              {ticket?.updated_at && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(ticket?.updated_at)}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardBody className="space-y-2">
              <select
                value={ticket?.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-odpp-blue focus:border-odpp-blue sm:text-sm"
              >
                <option value="new">New</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
