import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Spinner from "../common/Spinner";

export default function AssignmentModal({
  isOpen,
  onClose,
  ticket,
  officers = [],
  isLoading = false,
  onAssign,
}) {
  const [selectedOfficerId, setSelectedOfficerId] = useState(
    ticket?.assigned_to?.id || ""
  );
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedOfficerId) {
      setError("Please select an officer to assign");
      return;
    }

    try {
      await onAssign(selectedOfficerId);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to assign ticket");
    }
  };

  const currentAssigneeId = ticket?.assigned_to?.id || ticket?.assigned_to;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Ticket" size="md">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Ticket</p>
            <p className="font-medium text-gray-900">
              {ticket?.ticket_number}
            </p>
            <p className="text-gray-700 mt-1">{ticket?.title}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to ICT Officer
            </label>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Spinner size="md" />
              </div>
            ) : (
              <select
                value={selectedOfficerId}
                onChange={(e) => setSelectedOfficerId(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-odpp-blue focus:border-odpp-blue sm:text-sm"
              >
                <option value="">-- Select Officer --</option>
                {officers.map((officer) => (
                  <option
                    key={officer.id}
                    value={officer.id}
                    disabled={officer.id === currentAssigneeId}
                  >
                    {officer.name} ({officer.email})
                    {officer.id === currentAssigneeId ? " (current)" : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedOfficerId && selectedOfficerId === currentAssigneeId && (
            <p className="text-sm text-amber-600">
              This ticket is already assigned to the selected officer.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!selectedOfficerId || selectedOfficerId === currentAssigneeId}
          >
            Assign Ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
}