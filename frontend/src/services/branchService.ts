import api from './api';

interface Branch {
  id: string;
  name: string;
  country: string;
  phone: string;
}

interface BranchesResponse {
  success: boolean;
  data: {
    branches: Branch[];
    total: number;
    limit: number;
    offset: number;
  };
}

class BranchService {
  async getAllBranches(limit: number = 100, offset: number = 0): Promise<BranchesResponse> {
    const response = await api.get<BranchesResponse>('/branches', {
      params: { limit, offset },
    });
    return response.data;
  }

  async getBranchById(id: string): Promise<any> {
    const response = await api.get(`/branches/${id}`);
    return response.data;
  }
}

export default new BranchService();
