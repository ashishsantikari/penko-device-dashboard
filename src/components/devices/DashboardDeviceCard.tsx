import React from 'react';
import type { Device, DeviceMetrics } from '@/types/device';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeviceStatusIndicator } from './DeviceStatusIndicator';
import { format } from 'date-fns';

interface DashboardDeviceCardProps {
  device: Device;
  metrics?: DeviceMetrics;
  onClick: () => void;
}

export const DashboardDeviceCard: React.FC<DashboardDeviceCardProps> = ({
  device,
  metrics,
  onClick,
}) => {
  const formatWeight = (num: number | undefined): string => {
    if (num === undefined) return '---';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow relative dark:bg-gray-800 dark:border-gray-700 h-full"
      onClick={onClick}
    >
      {/* Status Badge in Top-Right Corner */}
      <div className="absolute top-2 right-2 z-10">
        <DeviceStatusIndicator
          status={device.connectionStatus}
          deviceStatus={device.status}
          percentage={device.statusPercentage}
          variant="badge"
        />
      </div>

      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="pr-16 text-base dark:text-gray-100">
          {device.name}
        </CardTitle>
        <p className="text-xs text-muted-foreground dark:text-gray-400">
          {device.type}
        </p>
      </CardHeader>

      <CardContent className="space-y-2 px-4 pb-3">
        {/* Weight Metrics Section */}
        {metrics ? (
          <div className="space-y-2">
            {/* Net Weight - Primary metric */}
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-muted-foreground dark:text-gray-400">
                Net:
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold dark:text-gray-100 tabular-nums">
                  {formatWeight(metrics.netWeight)}
                </span>
                <span className="text-xs text-muted-foreground dark:text-gray-400">
                  kg
                </span>
              </div>
            </div>

            {/* Gross Weight */}
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-muted-foreground dark:text-gray-400">
                Gross:
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm dark:text-gray-200 tabular-nums">
                  {formatWeight(metrics.grossWeight)}
                </span>
                <span className="text-xs text-muted-foreground dark:text-gray-400">
                  kg
                </span>
              </div>
            </div>

            {/* Tare Weight */}
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-muted-foreground dark:text-gray-400">
                Tare:
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm dark:text-gray-200 tabular-nums">
                  {formatWeight(metrics.tareWeight)}
                </span>
                <span className="text-xs text-muted-foreground dark:text-gray-400">
                  kg
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No data available</div>
        )}

        {/* Last Update Time */}
        <div className="text-[10px] text-muted-foreground dark:text-gray-400 pt-2 border-t dark:border-gray-700">
          <span className="font-medium">Updated:</span>{' '}
          {format(device.lastUpdate, 'HH:mm:ss')}
        </div>
      </CardContent>
    </Card>
  );
};
