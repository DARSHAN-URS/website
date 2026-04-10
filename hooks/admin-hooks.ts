import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.getDashboardSummary,
  });
};

export const useUsers = (params?: any) => {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => adminApi.getUsers(params),
  });
};

export const useWorkers = (params?: any) => {
  return useQuery({
    queryKey: ['admin-workers', params],
    queryFn: () => adminApi.getWorkers(params),
  });
};

export const useBookings = (params?: any) => {
  return useQuery({
    queryKey: ['admin-bookings', params],
    queryFn: () => adminApi.getBookings(params),
  });
};

export const useDisputes = (params?: any) => {
  return useQuery({
    queryKey: ['admin-disputes', params],
    queryFn: () => adminApi.getDisputes(params),
  });
};

export const useAnalytics = (params?: any) => {
  return useQuery({
    queryKey: ['admin-analytics', params],
    queryFn: () => adminApi.getAnalytics(params),
  });
};

export const useHealth = () => {
  return useQuery({
    queryKey: ['admin-health'],
    queryFn: adminApi.getHealth,
    refetchInterval: 30000, // Refresh every 30s
  });
};
