import api from "./api";

const knowledgeBaseService = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== "" && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    const response = await api.get(`/knowledge-base?${queryParams.toString()}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/knowledge-base/${id}`);
    return response.data.article;
  },

  create: async (data) => {
    const response = await api.post("/knowledge-base", data);
    return response.data.article;
  },

  update: async (id, data) => {
    const response = await api.put(`/knowledge-base/${id}`, data);
    return response.data.article;
  },

  delete: async (id) => {
    const response = await api.delete(`/knowledge-base/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get("/knowledge-base/categories");
    return response.data.categories;
  },
};

export default knowledgeBaseService;
export { knowledgeBaseService };