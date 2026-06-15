export interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  store?: {
    id: string;
    name: string;
    averageRating: number | null;
  };
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  STORE_OWNER = 'STORE_OWNER',
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  owner?: { id: string; name: string; email?: string };
  averageRating: number;
  userRating: number | null;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: string;
  rating: number;
  userId: string;
  storeId: string;
  user?: { id: string; name: string; email: string };
  store?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
  accessToken: string;
  refreshToken: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminDashboard {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
  ratingsDistribution: { rating: number; count: number }[];
  usersByRole: { role: string; count: number }[];
}

export interface StoreOwnerDashboard {
  store: {
    id: string;
    name: string;
    email: string;
    address: string;
  } | null;
  averageRating: number;
  totalRatings: number;
  ratings: {
    id: string;
    rating: number;
    userName: string;
    userEmail: string;
    createdAt: string;
    updatedAt: string;
  }[];
}
