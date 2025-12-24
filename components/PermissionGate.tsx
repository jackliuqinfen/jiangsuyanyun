
import React, { ReactNode } from 'react';
import { storageService } from '../services/storageService';
import { ResourceType } from '../types';

interface PermissionGateProps {
  children: ReactNode;
  resource: ResourceType;
  action?: 'read' | 'write' | 'delete';
  fallback?: ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({ 
  children, 
  resource, 
  action = 'read',
  fallback = null 
}) => {
  const role = storageService.getCurrentUserRole();

  if (!role) return <>{fallback}</>;

  const permission = role.permissions[resource];

  if (!permission) return <>{fallback}</>;

  let hasPermission = false;

  switch (action) {
    case 'read':
      hasPermission = permission.read;
      break;
    case 'write':
      hasPermission = permission.write;
      break;
    case 'delete':
      hasPermission = permission.delete;
      break;
  }

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGate;
