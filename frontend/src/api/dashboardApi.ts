import api from './axios';
import { AdminDashboard, StoreOwnerDashboard } from '../types';

export const dashboardApi = {
  getAdminDashboard: () =>
    api.get<AdminDashboard>('/dashboard/admin'),

  getStoreOwnerDashboard: () =>
    api.get<StoreOwnerDashboard>('/dashboard/store-owner'),
};
