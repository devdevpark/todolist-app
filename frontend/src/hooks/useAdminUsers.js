import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/admin-api';

export const useAdminUsers = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminApi.getUsers,
    staleTime: 30000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, isActive }) => adminApi.updateUserStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

  return {
    users: users || [],
    isLoading,
    error,
    refetch,
    updateUserStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
  };
};