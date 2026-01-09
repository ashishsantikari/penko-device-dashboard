import React from 'react';
import type { Device, DeviceMetrics } from '@/types/device';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { DeviceStatusIndicator } from './DeviceStatusIndicator';
import { AnimatedValue } from '@/components/common/AnimatedValue';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { CheckCircle2, XCircle, Thermometer, Activity } from 'lucide-react';

interface DeviceDetailModalProps {
  device: Device | null;
  metrics?: DeviceMetrics;
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({
  device,
  metrics,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  const formatWeight = (val: number | string): string => {
    if (val === undefined || val === null) return '---';
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '---';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatTemp = (val: number | string): string => {
    if (val === undefined || val === null) return '---';
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '---';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  };

  if (!device) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{device.name}</DialogTitle>
              <DialogDescription>
                {device.type} • {device.location || 'No location'}
              </DialogDescription>
            </div>
            <DeviceStatusIndicator
              status={device.connectionStatus}
              deviceStatus={device.status}
              percentage={device.statusPercentage}
              variant="badge"
            />
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Weight Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {t('devices.weightMeasurements')}
            </h3>

            <div className="bg-muted p-4 rounded-lg space-y-3">
              {/* Net Weight */}
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-muted-foreground">
                  Net Weight
                </span>
                <div className="flex items-baseline gap-2">
                  {metrics ? (
                    <AnimatedValue
                      value={metrics.netWeight}
                      formatValue={formatWeight}
                      className="text-2xl font-bold tabular-nums"
                    />
                  ) : (
                    <span className="text-2xl font-bold">---</span>
                  )}
                  <span className="text-sm text-muted-foreground">kg</span>
                </div>
              </div>

              {/* Gross Weight */}
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-muted-foreground">
                  {t('devices.grossWeight')}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold tabular-nums">
                    {formatWeight(metrics?.grossWeight ?? NaN)}
                  </span>
                  <span className="text-sm text-muted-foreground">kg</span>
                </div>
              </div>

              {/* Tare Weight */}
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-muted-foreground">
                  {t('devices.tareWeight')}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold tabular-nums">
                    {formatWeight(metrics?.tareWeight ?? NaN)}
                  </span>
                  <span className="text-sm text-muted-foreground">kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Device Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('devices.deviceInfo')}</h3>

            <div className="space-y-3">
              {/* Stability */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">{t('devices.stability')}</span>
                {metrics?.isStable ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">{t('devices.stable')}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{t('devices.settling')}</span>
                  </div>
                )}
              </div>

              {/* Temperature */}
              {metrics?.temperature !== undefined && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    <span className="text-sm font-medium">{t('devices.temperature')}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <AnimatedValue
                      value={metrics.temperature}
                      formatValue={formatTemp}
                      className="text-lg font-semibold tabular-nums"
                    />
                    <span className="text-sm text-muted-foreground">°C</span>
                  </div>
                </div>
              )}

              {/* Load Cells */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">{t('devices.loadCells')}</span>
                <span className="text-sm font-semibold">
                  {metrics?.loadCellCount || 0} {t('common.active')}
                </span>
              </div>

              {/* Measuring Speed */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">{t('devices.samplingRate')}</span>
                <span className="text-sm font-semibold">
                  {metrics?.measuringSpeed || 0} {t('devices.perSecond')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>{t('devices.deviceId')}: {device.id}</span>
            <span>
              {t('common.lastUpdate')}: {format(device.lastUpdate, 'HH:mm:ss')}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
