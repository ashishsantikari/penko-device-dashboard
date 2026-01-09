import React from 'react';
import { ConnectionStatus } from '@/types/device';
import type { ConnectionStatus as ConnectionStatusType, DeviceStatus } from '@/types/device';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { DeviceStatusIcon } from './DeviceStatusIcon';

interface DeviceStatusIndicatorProps {
  status: ConnectionStatusType;
  deviceStatus?: DeviceStatus;
  percentage?: number;
  variant?: 'badge' | 'icon';
}

export const DeviceStatusIndicator: React.FC<DeviceStatusIndicatorProps> = ({ 
  status, 
  deviceStatus = 'active',
  percentage,
  variant = 'badge' 
}) => {
  const { t } = useTranslation();

  // If variant is 'icon', use the DeviceStatusIcon component
  if (variant === 'icon') {
    return (
      <DeviceStatusIcon
        status={deviceStatus}
        connectionStatus={status}
        percentage={percentage}
        size="medium"
      />
    );
  }

  // Default badge variant

  const getStatusColor = () => {
    switch (status) {
      case ConnectionStatus.CONNECTED:
        return 'bg-green-500';
      case ConnectionStatus.DISCONNECTED:
        return 'bg-gray-500';
      case ConnectionStatus.ERROR:
        return 'bg-red-500';
      case ConnectionStatus.CONNECTING:
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case ConnectionStatus.CONNECTED:
        return t('devices.connected');
      case ConnectionStatus.DISCONNECTED:
        return t('devices.disconnected');
      case ConnectionStatus.ERROR:
        return t('devices.error');
      case ConnectionStatus.CONNECTING:
        return t('devices.connecting');
      default:
        return status;
    }
  };

  return (
    <Badge variant="outline" className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
      {getStatusText()}
    </Badge>
  );
};
