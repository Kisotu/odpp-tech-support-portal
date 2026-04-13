import api from "./api";

const userService = {
  /**
   * Get all users with optional filters
   * @param {Object} params - Query parameters (role, is_active, search, per_page)
   * @returns {Promise} - Users data with pagination
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

    const response = await api.get(`/users?${queryParams.toString()}`);
    const { data, meta } = response.data;

    return {
      users: data || [],
      pagination: {
        currentPage: meta?.current_page || 1,
        totalPages: meta?.last_page || 1,
        totalItems: meta?.total || 0,
        perPage: meta?.per_page || 15,
      },
    };
  },

  /**
   * Get a single user by ID
   * @param {string|number} id - User ID
   * @returns {Promise} - User data
   */
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  /**
   * Get all active ICT officers
   * @returns {Promise} - Array of ICT officers
   */
  getIctOfficers: async () => {
    const response = await api.get("/users/role/ict-officers");
    return response.data.data || [];
  },

  /**
   * Create a new user
   * @param {Object} data - User data
   * @returns {Promise} - Created user
   */
  create: async (data) => {
    const response = await api.post("/users", data);
    return response.data.data;
  },

  /**
   * Update an existing user
   * @param {string|number} id - User ID
   * @param {Object} data - Updated user data
   * @returns {Promise} - Updated user
   */
  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
  },

  /**
   * Deactivate a user
   * @param {string|number} id - User ID
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default userService;
export { userService };