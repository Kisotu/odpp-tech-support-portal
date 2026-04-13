import api from "./api";

const ticketService = {
  /**
   * Get all tickets with optional filters
   * @param {Object} params - Query parameters
   * @returns {Promise} - Tickets data with pagination
   */
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (
        params[key] !== "" &&
        params[key] !== null &&
        params[key] !== undefined
      ) {
        queryParams.append(key, params[key]);
      }
    });

    const response = await api.get(`/tickets?${queryParams.toString()}`);
    return response.data;
  },

  /**
   * Get a single ticket by ID
   * @param {string|number} id - Ticket ID
   * @returns {Promise} - Ticket data
   */
  getById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  /**
   * Create a new ticket
   * @param {Object} data - Ticket data
   * @returns {Promise} - Created ticket
   */
  create: async (data) => {
    const response = await api.post("/tickets", data);
    return response.data;
  },

  /**
   * Update an existing ticket
   * @param {string|number} id - Ticket ID
   * @param {Object} data - Updated ticket data
   * @returns {Promise} - Updated ticket
   */
  update: async (id, data) => {
    const response = await api.put(`/tickets/${id}`, data);
    return response.data;
  },

  /**
   * Delete a ticket
   * @param {string|number} id - Ticket ID
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },

  /**
   * Add a comment to a ticket
   * @param {string|number} ticketId - Ticket ID
   * @param {Object} comment - Comment data
   * @returns {Promise} - Created comment
   */
  addComment: async (ticketId, comment) => {
    const response = await api.post(`/tickets/${ticketId}/comments`, comment);
    return response.data;
  },

  /**
   * Get comments for a ticket
   * @param {string|number} ticketId - Ticket ID
   * @returns {Promise} - Array of comments
   */
  getComments: async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  /**
   * Upload an attachment to a ticket
   * @param {string|number} ticketId - Ticket ID
   * @param {FormData} formData - Form data containing the file
   * @returns {Promise} - Upload result
   */
  uploadAttachment: async (ticketId, formData) => {
    const response = await api.post(
      `/tickets/${ticketId}/attachments`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  /**
   * Delete an attachment
   * @param {string|number} ticketId - Ticket ID
   * @param {string|number} attachmentId - Attachment ID
   * @returns {Promise}
   */
  deleteAttachment: async (ticketId, attachmentId) => {
    const response = await api.delete(
      `/tickets/${ticketId}/attachments/${attachmentId}`,
    );
    return response.data;
  },

  /**
   * Assign a ticket to a user
   * @param {string|number} ticketId - Ticket ID
   * @param {string|number} userId - User ID to assign
   * @returns {Promise} - Updated ticket
   */
  assign: async (ticketId, userId) => {
    const response = await api.post(`/tickets/${ticketId}/assign`, {
      assigned_to: userId,
    });
    return response.data;
  },

  /**
   * Update ticket status
   * @param {string|number} ticketId - Ticket ID
   * @param {string} status - New status
   * @returns {Promise} - Updated ticket
   */
  updateStatus: async (ticketId, status) => {
    const response = await api.put(`/tickets/${ticketId}/status`, { status });
    return response.data;
  },

  /**
   * Get ticket statistics
   * @returns {Promise} - Statistics data
   */
  getStats: async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },
};

export default ticketService;
export { ticketService };
