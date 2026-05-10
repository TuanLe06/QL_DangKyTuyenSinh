import api from './axios';

export const userApi = {
  getAll: (page = 1, limit = 10) => api.get(`/users?page=${page}&limit=${limit}`),
  getById: (id: number) => api.get(`/users/${id}`),
  update: (id: number, data: Record<string, unknown>) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};
