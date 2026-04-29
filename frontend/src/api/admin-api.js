import { get, patch } from './http-client';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

export const adminApi = {
  getUsers: async () => {
    return get(API_ENDPOINTS.ADMIN.USERS);
  },

  updateUserStatus: async (userId, isActive) => {
    return patch(API_ENDPOINTS.ADMIN.USER_STATUS(userId), { isActive });
  },
};