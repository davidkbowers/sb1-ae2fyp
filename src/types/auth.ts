export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  subscription: {
    status: 'active' | 'inactive' | 'cancelled';
    plan: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}