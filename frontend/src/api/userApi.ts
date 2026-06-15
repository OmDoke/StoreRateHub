import api from './axios';
import { User, PaginatedResponse } from '../types';

export const userApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<User>>('/users', { params }),

  getOne: (id: string) =>
    api.get<User>(`/users/${id}`),

  create: (data: any) =>
    api.post<User>('/users', data),

  update: (id: string, data: any) =>
    api.put<User>(`/users/${id}`, data),

  delete: (id: string) =>
    api.delete(`/users/${id}`),
};
