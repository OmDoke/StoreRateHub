import api from './axios';
import { Store, PaginatedResponse } from '../types';

export const storeApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Store>>('/stores', { params }),

  getOne: (id: string) =>
    api.get<Store>(`/stores/${id}`),

  create: (data: any) =>
    api.post<Store>('/stores', data),

  update: (id: string, data: any) =>
    api.put<Store>(`/stores/${id}`, data),

  delete: (id: string) =>
    api.delete(`/stores/${id}`),
};
