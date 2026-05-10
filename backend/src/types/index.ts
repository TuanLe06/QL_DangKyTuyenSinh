export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserPayload {
  id: number;
  email: string;
  role: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
