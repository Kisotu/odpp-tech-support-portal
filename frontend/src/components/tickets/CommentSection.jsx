import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import ticketService from "../../services/ticketService";

export default function CommentSection({ ticketId }) {
  const [newComment, setNewComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const queryClient = useQueryClient();

  // Fetch comments
  const {
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments", ticketId],
    queryFn: () => ticketService.getComments(ticketId),
    enabled: !!ticketId,
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (data) => ticketService.addComment(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      setNewComment("");
      setIsInternal(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addCommentMutation.mutate({
      content: newComment.trim(),
      is_internal: isInternal,
    });
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <Spinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
        Failed to load comments. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comments List */}
      <div className="space-y-4">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`bg-white border rounded-lg p-4 ${
                comment.is_internal
                  ? "border-yellow-300 bg-yellow-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-odpp-blue flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {comment.author?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {comment.author?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {comment.created_at &&
                        new Date(comment.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                    </p>
                  </div>
                </div>
                {comment.is_internal && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Internal Note
                  </span>
                )}
              </div>
              <div className="ml-10">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No comments yet.</p>
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Add a comment
          </label>
          <textarea
            id="comment"
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type your comment here..."
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-odpp-blue focus:border-odpp-blue sm:text-sm resize-none"
          />
        </div>

        <div className="flex items-center">
          <input
            id="is-internal"
            type="checkbox"
            checked={isInternal}
            onChange={(e) => setIsInternal(e.target.checked)}
            className="h-4 w-4 text-odpp-blue focus:ring-odpp-blue border-gray-300 rounded"
          />
          <label
            htmlFor="is-internal"
            className="ml-2 block text-sm text-gray-700"
          >
            Mark as internal note (only visible to staff)
          </label>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            loading={addCommentMutation.isPending}
            disabled={!newComment.trim()}
          >
            Post Comment
          </Button>
        </div>

        {addCommentMutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
            Failed to post comment. Please try again.
          </div>
        )}
      </form>
    </div>
  );
}
