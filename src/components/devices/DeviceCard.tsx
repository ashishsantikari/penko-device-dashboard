import React from 'react';
import type { Device } from '@/types/device';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeviceStatusIndicator } from './DeviceStatusIndicator';
import { AnimatedValue } from '@/components/common/AnimatedValue';
import { useLatestDeviceMetrics } from '@/hooks/useDeviceData';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useLocation } from 'wouter';
import { CheckCircle2, XCircle } from 'lucide-react';

interface DeviceCardProps {
  device: Device;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const latestMetrics = useLatestDeviceMetrics(device.id);

  const formatWeight = (val: number | string): string => {
    if (val === undefined || val === null) return '---';
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '---';
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatTemp = (val: number | string): string => {
    if (val === undefined || val === null) return '---';
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '---';
    return num.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow relative dark:bg-gray-800 dark:border-gray-700 h-full"
      onClick={() => setLocation(`/devices/${device.id}`)}
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
        <CardTitle className="pr-16 text-base dark:text-gray-100">{device.name}</CardTitle>
        <p className="text-xs text-muted-foreground dark:text-gray-400">{device.type}</p>
      </CardHeader>
      
      <CardContent className="space-y-2 px-4 pb-3">
        {/* Weight Metrics Section - Fixed width to prevent layout shift */}
        {latestMetrics && (
          <div className="space-y-1.5">
            {/* Net Weight - Primary metric */}
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-muted-foreground dark:text-gray-400 w-14">{t('devices.net')}:</span>
              <div className="flex items-baseline gap-1 min-w-[100px] justify-end">
                <AnimatedValue
                  value={latestMetrics.netWeight}
                  formatValue={formatWeight}
                  className="text-lg font-bold dark:text-gray-100 px-1 py-0.5 rounded tabular-nums"
                />
                <span className="text-xs text-muted-foreground dark:text-gray-400">kg</span>
              </div>
            </div>

            {/* Gross Weight */}
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-muted-foreground dark:text-gray-400 w-14">{t('devices.gross')}:</span>
              <div className="flex items-baseline gap-1 min-w-[100px] justify-end">
                <AnimatedValue
                  value={latestMetrics.grossWeight}
                  formatValue={formatWeight}
                  className="text-sm dark:text-gray-200 px-1 py-0.5 rounded tabular-nums"
                />
                <span className="text-xs text-muted-foreground dark:text-gray-400">kg</span>
              </div>
            </div>

            {/* Tare Weight */}
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-muted-foreground dark:text-gray-400 w-14">{t('devices.tare')}:</span>
              <div className="flex items-baseline gap-1 min-w-[100px] justify-end">
                <span className="text-sm dark:text-gray-200 tabular-nums">{formatWeight(latestMetrics.tareWeight)}</span>
                <span className="text-xs text-muted-foreground dark:text-gray-400">kg</span>
              </div>
            </div>

            {/* Stability Indicator */}
            <div className="flex items-center justify-between pt-1 border-t dark:border-gray-700">
              <span className="text-xs font-medium text-muted-foreground dark:text-gray-400">{t('devices.stability')}:</span>
              <div className="flex items-center gap-1">
                {latestMetrics.isStable ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                    <span className="text-xs text-green-600 dark:text-green-400">{t('devices.stable')}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-xs text-yellow-600 dark:text-yellow-400">{t('devices.settling')}</span>
                  </>
                )}
              </div>
            </div>

            {/* Temperature (if available) */}
            {latestMetrics.temperature !== undefined && (
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-muted-foreground dark:text-gray-400">{t('devices.temp')}:</span>
                <div className="flex items-baseline gap-1 min-w-[70px] justify-end">
                  <AnimatedValue
                    value={latestMetrics.temperature}
                    formatValue={formatTemp}
                    className="text-sm dark:text-gray-200 px-1 py-0.5 rounded tabular-nums"
                  />
                  <span className="text-xs text-muted-foreground dark:text-gray-400">°C</span>
                </div>
              </div>
            )}

            {/* Load Cells Info */}
            <div className="flex items-center justify-between text-[10px] text-muted-foreground dark:text-gray-500 pt-1 border-t dark:border-gray-700">
              <span>{latestMetrics.loadCellCount} {latestMetrics.loadCellCount === 1 ? t('devices.cells_one') : t('devices.cells_other')}</span>
              <span>{latestMetrics.measuringSpeed}/s</span>
            </div>
          </div>
        )}

        {/* Last Update Time */}
        <div className="text-[10px] text-muted-foreground dark:text-gray-400 pt-1 border-t dark:border-gray-700">
          <span className="font-medium">{t('devices.updated')}:</span>{' '}
          {format(device.lastUpdate, 'HH:mm:ss')}
        </div>
      </CardContent>
    </Card>
  );
};
