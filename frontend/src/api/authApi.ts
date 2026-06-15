import api from './axios';
import type { AuthResponse } from '../types';

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  register: (data: { name: string; email: string; password: string; address?: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', data),

  refresh: () =>
    api.post('/auth/refresh'),
};
