import React from 'react';
import type { DeviceStatus, ConnectionStatus } from '@/types/device';
import { CheckCircle2, AlertTriangle, XCircle, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeviceStatusIconProps {
  status: DeviceStatus;
  connectionStatus: ConnectionStatus;
  percentage?: number;
  size?: 'small' | 'medium' | 'large';
}

export const DeviceStatusIcon: React.FC<DeviceStatusIconProps> = ({
  status,
  connectionStatus,
  percentage,
  size = 'large',
}) => {
  const getStatusConfig = () => {
    // Error or disconnected takes priority
    if (status === 'error' || connectionStatus === 'disconnected' || connectionStatus === 'error') {
      return {
        icon: XCircle,
        colorLight: 'text-red-600 bg-red-50',
        colorDark: 'dark:text-red-400 dark:bg-red-900/20',
        label: 'Error',
      };
    }

    // Maintenance status
    if (status === 'maintenance') {
      return {
        icon: Wrench,
        colorLight: 'text-blue-600 bg-blue-50',
        colorDark: 'dark:text-blue-400 dark:bg-blue-900/20',
        label: 'Maintenance',
      };
    }

    // Idle status
    if (status === 'idle') {
      return {
        icon: AlertTriangle,
        colorLight: 'text-yellow-600 bg-yellow-50',
        colorDark: 'dark:text-yellow-400 dark:bg-yellow-900/20',
        label: 'Idle',
      };
    }

    // Active and connected (default/success state)
    return {
      icon: CheckCircle2,
      colorLight: 'text-green-600 bg-green-50',
      colorDark: 'dark:text-green-400 dark:bg-green-900/20',
      label: 'Active',
    };
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'p-2',
          icon: 'h-4 w-4',
          text: 'text-xs',
        };
      case 'medium':
        return {
          container: 'p-3',
          icon: 'h-6 w-6',
          text: 'text-sm',
        };
      case 'large':
        return {
          container: 'p-4',
          icon: 'h-8 w-8',
          text: 'text-base',
        };
      default:
        return {
          container: 'p-4',
          icon: 'h-8 w-8',
          text: 'text-base',
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = getSizeClasses();
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg',
        config.colorLight,
        config.colorDark,
        sizeClasses.container
      )}
    >
      <Icon className={sizeClasses.icon} />
      {percentage !== undefined && (
        <span className={cn('font-semibold', sizeClasses.text)}>
          {percentage}%
        </span>
      )}
    </div>
  );
};
