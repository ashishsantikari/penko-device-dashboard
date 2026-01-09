import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { useDevice } from '@/hooks/useDeviceData';
import { useDeviceMetricsSubscription } from '@/components/providers/WebSocketDataProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DeviceStatusIndicator } from '@/components/devices/DeviceStatusIndicator';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Activity } from 'lucide-react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import type { DeviceMetrics } from '@/types/device';

export const DeviceDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const deviceId = params.id!;
  
  const { data: device, isLoading: deviceLoading } = useDevice(deviceId);
  // Subscribe to real-time metrics for this device
  const liveMetrics = useDeviceMetricsSubscription(deviceId);
  
  // Maintain a history of metrics for display
  const [metricsHistory, setMetricsHistory] = useState<DeviceMetrics[]>([]);

  // Update history when new live metrics arrive
  useEffect(() => {
    if (liveMetrics) {
      setMetricsHistory(prev => {
        const newHistory = [...prev, liveMetrics];
        // Keep last 100 metrics
        return newHistory.slice(-100);
      });
    }
  }, [liveMetrics]);

  if (deviceLoading) {
    return (
      <div className="container mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!device) {
    return (
      <div className="container mx-auto">
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Device not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const latestMetric = liveMetrics || (metricsHistory.length > 0 ? metricsHistory[metricsHistory.length - 1] : null);

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/devices">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{device.name}</h1>
        <div className="flex items-center gap-2 ml-auto">
          <Activity className="h-5 w-5 text-green-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
            <CardDescription>Basic details and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm font-medium">ID:</span>
              <p className="text-sm text-muted-foreground">{device.id}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Type:</span>
              <p className="text-sm text-muted-foreground">{device.type}</p>
            </div>
            {device.location && (
              <div>
                <span className="text-sm font-medium">Location:</span>
                <p className="text-sm text-muted-foreground">{device.location}</p>
              </div>
            )}
            <div>
              <span className="text-sm font-medium">Connection Status:</span>
              <div className="mt-2">
                <DeviceStatusIndicator status={device.connectionStatus} />
              </div>
            </div>
            <div>
              <span className="text-sm font-medium">Device Status:</span>
              <p className="text-sm text-muted-foreground">{device.status}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Last Update:</span>
              <p className="text-sm text-muted-foreground">
                {format(device.lastUpdate, 'PPpp')}
              </p>
            </div>
          </CardContent>
        </Card>

        {latestMetric && (
          <Card>
            <CardHeader>
              <CardTitle>Live Metrics</CardTitle>
              <CardDescription>Real-time sensor readings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">{t('devices.weight')}:</span>
                  <p className="text-3xl font-bold">{latestMetric.netWeight.toFixed(2)} kg</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block">Gross</span>
                  <p className="text-lg font-semibold">{latestMetric.grossWeight.toFixed(2)} kg</p>
                  <span className="text-xs text-muted-foreground block mt-1">Tare</span>
                  <p className="text-lg font-semibold">{latestMetric.tareWeight.toFixed(2)} kg</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">{t('devices.temperature')}:</span>
                    <p className="text-2xl font-bold">{latestMetric.temperature?.toFixed(1) || '--'} °C</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Stability:</span>
                    <p className="text-lg font-semibold">
                      {latestMetric.isStable ? (
                        <span className="text-green-600">Stable</span>
                      ) : (
                        <span className="text-yellow-600">Settling</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {latestMetric.batteryLevel !== undefined && (
                <div>
                  <span className="text-sm font-medium">{t('devices.battery')}:</span>
                  <p className="text-2xl font-bold">{latestMetric.batteryLevel.toFixed(0)}%</p>
                </div>
              )}
              
              <div className="border-t pt-4">
                <span className="text-sm font-medium">Load Cells:</span>
                <p className="text-lg font-semibold">{latestMetric.loadCellCount} active</p>
                <span className="text-sm font-medium mt-2 block">Measuring Speed:</span>
                <p className="text-lg font-semibold">{latestMetric.measuringSpeed} /s</p>
              </div>
              
              <div>
                <span className="text-sm font-medium">Last Update:</span>
                <p className="text-sm text-muted-foreground">
                  {format(latestMetric.timestamp, 'PPpp')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {metricsHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Metrics History</CardTitle>
            <CardDescription>Recent readings ({metricsHistory.length} total) - Updates in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {metricsHistory.slice().reverse().map((metric, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">
                    {format(metric.timestamp, 'PPpp')}
                  </span>
                  <div className="flex gap-4 text-sm">
                    <span className="font-mono">{metric.netWeight.toFixed(2)} kg</span>
                    <span className="font-mono text-muted-foreground">{metric.temperature?.toFixed(1) || '--'} °C</span>
                    {metric.batteryLevel !== undefined && <span className="font-mono">{metric.batteryLevel.toFixed(0)}%</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
