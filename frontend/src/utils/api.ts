const API_BASE_URL = 'http://localhost:8000/api';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'associate' | 'manager';
  store_id: string;
  store_name: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'associate' | 'manager';
    store_id: string;
    store_name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  access_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string;
}

export const registerUser = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  console.log('[DEBUG] Frontend - Sending registration request:', userData);
  console.log('[DEBUG] Frontend - API URL:', `${API_BASE_URL}/auth/register`);
  
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  console.log('[DEBUG] Frontend - Response status:', response.status);
  console.log('[DEBUG] Frontend - Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    console.log('[DEBUG] Frontend - Error response:', errorData);
    throw new Error(errorData.detail || 'Registration failed');
  }

  const responseData = await response.json();
  console.log('[DEBUG] Frontend - Success response:', responseData);
  return responseData;
};

export interface LoginRequest {
  email: string;
  password: string;
  role: 'associate' | 'manager';
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'associate' | 'manager';
    store_id: string;
    store_name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.detail || 'Login failed');
  }

  return response.json();
};

export const getRoles = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/roles`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch roles');
  }
  
  return response.json();
};