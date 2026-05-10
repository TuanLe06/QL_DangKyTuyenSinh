import api from './axios';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const authApi = {
  login: (data: LoginPayload) => api.post('/auth/login', data),
  register: (data: RegisterPayload) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};
