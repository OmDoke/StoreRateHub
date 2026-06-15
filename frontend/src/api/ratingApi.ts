import api from './axios';
import { Rating } from '../types';

export const ratingApi = {
  create: (data: { rating: number; storeId: string }) =>
    api.post<Rating>('/ratings', data),

  update: (id: string, data: { rating: number }) =>
    api.put<Rating>(`/ratings/${id}`, data),

  getByStore: (storeId: string) =>
    api.get(`/ratings/store/${storeId}`),
};
