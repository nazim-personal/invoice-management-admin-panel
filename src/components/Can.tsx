import { usePermission } from '@/hooks/usePermission';
import React from 'react';

interface CanProps {
    permission: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const Can = ({ permission, children, fallback = null }: CanProps) => {
    const hasAccess = usePermission(permission);
    return hasAccess ? <>{children}</> : <>{fallback}</>;
};
