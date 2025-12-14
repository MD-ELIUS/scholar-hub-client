import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    isLoading: roleLoading,
    data: role = 'user',
    refetch
  } = useQuery({
    queryKey: ['user-role', user?.email],
    enabled: !!user?.email, // 🔥 important
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data?.role || 'user';
    }
  });

  return { role, roleLoading, refetchRole: refetch };
};

export default useRole;
