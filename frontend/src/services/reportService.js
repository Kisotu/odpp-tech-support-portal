import api from "./api";

const reportService = {
  getResolutionTimes: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== "" && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    const response = await api.get(`/reports/resolution-times?${queryParams.toString()}`);
    return response.data;
  },

  getByCategory: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== "" && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    const response = await api.get(`/reports/by-category?${queryParams.toString()}`);
    return response.data;
  },

  getSlaCompliance: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== "" && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    const response = await api.get(`/reports/sla-compliance?${queryParams.toString()}`);
    return response.data;
  },

  getOfficerWorkload: async () => {
    const response = await api.get("/reports/officer-workload");
    return response.data;
  },

  exportCsv: async (type = "tickets") => {
    const response = await api.get(`/reports/export-csv?type=${type}`, {
      responseType: "blob",
    });
    return response.data;
  },
};

export default reportService;
export { reportService };