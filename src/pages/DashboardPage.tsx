import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { useDevices } from '@/hooks/useDeviceData';
import { useDevicesMetricsSubscription, metricsStore } from '@/components/providers/WebSocketDataProvider';
import { DigitalDisplay } from '@/components/common/DigitalDisplay';
import { KeymapHelp, FullscreenButton } from '@/components/common/KeymapHelp';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { toggleFullscreen } from '@/hooks/useKeyMap';
import type { Device } from '@/types/device';

interface DataPoint {
  timestamp: Date;
  value: number;
}

interface DeviceData {
  device: Device;
  history: DataPoint[];
}

// Generate consistent color from device ID
const generateColor = (deviceId: string): string => {
  let hash = 0;
  for (let i = 0; i < deviceId.length; i++) {
    const char = deviceId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
};

const MAX_HISTORY_POINTS = 50;
const UPDATE_INTERVAL = 10000; // 10 seconds

// Mini Sparkline Component
const MiniSparkline: React.FC<{
  data: DataPoint[];
  color: string;
  width?: number;
  height?: number;
}> = ({ data, color, width = 120, height = 40 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length < 2) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.timestamp) as [Date, Date])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([
        d3.min(data, d => d.value) || 0,
        d3.max(data, d => d.value) || 100
      ])
      .range([height, 0]);

    const line = d3.line<DataPoint>()
      .x(d => xScale(d.timestamp))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add current point
    const lastPoint = data[data.length - 1];
    if (lastPoint) {
      svg.append('circle')
        .attr('cx', xScale(lastPoint.timestamp))
        .attr('cy', yScale(lastPoint.value))
        .attr('r', 3)
        .attr('fill', color);
    }
  }, [data, color, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="overflow-visible"
    />
  );
};

// Device Card with Digital Display
const DeviceMonitorCard: React.FC<{
  device: Device;
  history: DataPoint[];
  isFocused?: boolean;
}> = ({ device, history, isFocused = false }) => {
  const { t } = useTranslation();
  const color = generateColor(device.id);
  const latestValue = history[history.length - 1]?.value ?? 0;
  const isOffline = device.connectionStatus !== 'connected';
  
  return (
    <div 
      className={`
        bg-card border-2 rounded-xl p-4 transition-all duration-300
        ${isOffline ? 'border-gray-300 opacity-70' : 'border-border hover:border-primary/50'}
        ${isFocused ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="font-semibold text-sm truncate">{device.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{device.type}</span>
          {isFocused && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
              {t('common.pressForFullscreen')}
            </span>
          )}
        </div>
      </div>

      {/* Digital Display */}
      <DigitalDisplay
        value={latestValue}
        decimals={2}
        unit="kg"
        isOffline={isOffline}
        status={device.status}
        className="mb-4"
      />

      {/* Mini Trend Chart */}
      {history.length > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <MiniSparkline data={history} color={color} />
          </div>
          <div className="text-right ml-2">
            <div className="text-xs text-muted-foreground">{t('common.trend')}</div>
            <div className="text-xs font-mono">
              {history.length} {t('common.points')}
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
        <span>{t('common.id')}: {device.id.split('-').pop()}</span>
        <span>{isOffline ? t('common.disconnected') : t('common.live')}</span>
      </div>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: devices, isLoading, error } = useDevices();
  const [deviceDataMap, setDeviceDataMap] = useState<Map<string, DeviceData>>(new Map());
  const [focusedCardIndex, setFocusedCardIndex] = useState<number>(-1);
  const [isPageFullscreen, setIsPageFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const lastUpdateRef = useRef<number>(0);
  const dashboardContainerRef = useRef<HTMLDivElement>(null);

  // Get all device IDs for subscription
  const allDeviceIds = useMemo(() => {
    return devices?.map(d => d.id) || [];
  }, [devices]);

  // Subscribe to all devices
  useDevicesMetricsSubscription(allDeviceIds);

  // Update data every 10 seconds
  useEffect(() => {
    if (!devices) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastUpdateRef.current < UPDATE_INTERVAL) return;
      lastUpdateRef.current = now;

      setDeviceDataMap((prevMap) => {
        const newMap = new Map(prevMap);

        devices.forEach((device) => {
          const existing = newMap.get(device.id);
          const metrics = metricsStore.get(device.id);

          if (metrics) {
            const newPoint: DataPoint = {
              timestamp: new Date(metrics.timestamp),
              value: metrics.netWeight,
            };

            const history = existing 
              ? [...existing.history, newPoint].slice(-MAX_HISTORY_POINTS)
              : [newPoint];

            newMap.set(device.id, {
              device,
              history,
            });
          } else if (existing) {
            // Update device reference even if no new metrics
            newMap.set(device.id, {
              ...existing,
              device,
            });
          }
        });

        return newMap;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [devices]);

  // Handle fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsPageFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle help with ?
      if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
        e.preventDefault();
        setShowHelp(prev => !prev);
        return;
      }

      // Escape to exit fullscreen
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          e.preventDefault();
          document.exitFullscreen();
        }
        setFocusedCardIndex(-1);
        setShowHelp(false);
        return;
      }

      // F key for fullscreen
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        // If a card is focused, toggle that card's fullscreen
        // Otherwise toggle page fullscreen
        toggleFullscreen(dashboardContainerRef.current);
        return;
      }

      // Arrow keys for navigation
      const deviceArray = Array.from(deviceDataMap.values());
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedCardIndex(prev => 
          prev < deviceArray.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedCardIndex(prev => 
          prev > 0 ? prev - 1 : deviceArray.length - 1
        );
      } else if (e.key === 'Enter' && focusedCardIndex >= 0) {
        e.preventDefault();
        // Navigate to device detail page
        const device = deviceArray[focusedCardIndex]?.device;
        if (device) {
          window.location.href = `/devices/${device.id}`;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deviceDataMap, focusedCardIndex]);

  // Click to focus card
  const handleCardClick = useCallback((index: number) => {
    setFocusedCardIndex(index);
  }, []);

  // Toggle fullscreen handler
  const handleToggleFullscreen = useCallback(() => {
    toggleFullscreen(dashboardContainerRef.current);
  }, []);

  if (error) {
    return (
      <div className="container mx-auto">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-destructive">
            {t('common.error')}: {error.message}
          </p>
        </div>
      </div>
    );
  }

  const onlineCount = devices?.filter(d => d.connectionStatus === 'connected').length || 0;
  const totalCount = devices?.length || 0;

  const deviceArray = Array.from(deviceDataMap.values());

  return (
    <div 
      ref={dashboardContainerRef}
      className={`min-h-screen ${isPageFullscreen ? 'bg-background p-8' : ''}`}
    >
      <div className={`${isPageFullscreen ? 'container mx-auto' : 'container mx-auto'}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t('common.dashboard')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('common.digitalMonitoring')} • {onlineCount}/{totalCount} {t('common.devicesOnline')}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <FullscreenButton 
              onClick={handleToggleFullscreen}
              isFullscreen={isPageFullscreen}
            />
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span>{t('common.online')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500" />
                <span>{t('common.offline')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted-foreground bg-muted p-3 rounded-lg mb-6">
          <span>{t('common.updatesEvery')} 10 {t('common.seconds')} • {t('common.trend')} {t('common.charts')} {t('common.show')} {MAX_HISTORY_POINTS} {t('common.readings')}</span>
          <span className="text-primary">{t('common.pressForHelp')}</span>
        </div>

        {/* Digital Displays Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {deviceArray.map((deviceData, index) => (
                <div 
                  key={deviceData.device.id}
                  onClick={() => handleCardClick(index)}
                  className="cursor-pointer"
                >
                  <DeviceMonitorCard
                    device={deviceData.device}
                    history={deviceData.history}
                    isFocused={focusedCardIndex === index}
                  />
                </div>
              ))}
            </div>

            {deviceDataMap.size === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-lg font-medium">{t('common.waitingForData')}</p>
                <p className="text-sm">{t('common.connectDevices')}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Keyboard Shortcuts Help */}
      <KeymapHelp
        open={showHelp}
        onOpenChange={setShowHelp}
        keymaps={[
          { key: 'F', description: t('keyboardShortcuts.toggleFullscreen') },
          { key: '↑↓←→', description: t('keyboardShortcuts.navigateCards') },
          { key: 'Enter', description: t('keyboardShortcuts.openDeviceDetail') },
          { key: 'Esc', description: t('keyboardShortcuts.exitFullscreen') },
          { key: '?', description: t('keyboardShortcuts.toggleHelp') },
        ]}
      />
    </div>
  );
};
