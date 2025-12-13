import { useAuthContext } from '@/context/AuthContext';

export const usePermission = (requiredPermission: string) => {
  const { user } = useAuthContext();

  if (!user) return false;
  if (user.role === 'admin') return true; // Admin has all permissions

  return user.permissions?.includes(requiredPermission) ?? false;
};
