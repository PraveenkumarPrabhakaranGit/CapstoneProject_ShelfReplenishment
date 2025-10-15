const API_BASE_URL = 'http://localhost:8002/api';

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
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.detail || 'Registration failed');
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