import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: role = "student",
    isLoading: roleLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !loading && !!user?.email, 
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data?.role || "student";
    },
    retry: 1,               //  avoid infinite retry
    staleTime: 5 * 60 * 1000, // cache role for 5 min
  });

  return {
    role,
    roleLoading,
    refetchRole: refetch,
  };
};

export default useRole;
