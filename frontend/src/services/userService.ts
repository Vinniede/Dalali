import api from './api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  branch_id: string | null;
}

interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    total: number;
    limit: number;
    offset: number;
  };
}

class UserService {
  async getAllUsers(limit: number = 20, offset: number = 0): Promise<UsersResponse> {
    const response = await api.get<UsersResponse>('/users', {
      params: { limit, offset },
    });
    return response.data;
  }

  async createUser(data: any): Promise<any> {
    const response = await api.post('/users', data);
    return response.data;
  }

  async updateUser(id: string, data: any): Promise<any> {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<any> {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
}

export default new UserService();
