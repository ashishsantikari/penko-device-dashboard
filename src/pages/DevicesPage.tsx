import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useDevices } from '@/hooks/useDeviceData';
import { DeviceTable } from '@/components/devices/DeviceTable';
import { DeviceSearch } from '@/components/devices/DeviceSearch';
import { DashboardDeviceCard } from '@/components/devices/DashboardDeviceCard';
import { DeviceDetailModal } from '@/components/devices/DeviceDetailModal';
import { KeymapHelp, FullscreenButton } from '@/components/common/KeymapHelp';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, Table as TableIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Device } from '@/types/device';
import { useDevicesMetricsSubscription, useDeviceMetricsSubscription } from '@/components/providers/WebSocketDataProvider';
import { useKeyMap, toggleFullscreen } from '@/hooks/useKeyMap';

const ITEMS_PER_PAGE = 9;

// Wrapper component to get real-time metrics for each device card
const DeviceCardWithMetrics: React.FC<{
  device: Device;
  onClick: () => void;
  isFullscreen?: boolean;
}> = ({ device, onClick, isFullscreen = false }) => {
  const metrics = useDeviceMetricsSubscription(device.id);
  return (
    <div className={isFullscreen ? 'p-8 bg-background min-h-screen flex items-center justify-center' : ''}>
      <DashboardDeviceCard
        device={device}
        metrics={metrics}
        onClick={onClick}
      />
    </div>
  );
};

// Wrapper to get real-time metrics for the modal
const DeviceDetailModalWrapper: React.FC<{
  device: Device | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ device, isOpen, onClose }) => {
  const metrics = useDeviceMetricsSubscription(device?.id || '');
  
  return (
    <DeviceDetailModal
      device={device}
      metrics={metrics}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};

export const DevicesPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: devices, isLoading, error } = useDevices();
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [fullscreenCardIndex, setFullscreenCardIndex] = useState<number>(-1);
  const [isPageFullscreen, setIsPageFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  // Filter devices based on search
  const filteredDevices = useMemo(() => {
    if (!devices) return [];
    if (!searchQuery) return devices;
    
    const query = searchQuery.toLowerCase();
    return devices.filter((device) =>
      device.name.toLowerCase().includes(query) ||
      device.id.toLowerCase().includes(query) ||
      device.type.toLowerCase().includes(query)
    );
  }, [devices, searchQuery]);

  // Get device IDs for real-time subscription (only visible devices in grid view)
  const visibleDeviceIds = useMemo(() => {
    if (view === 'table') return filteredDevices.map(d => d.id);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDevices.slice(startIndex, startIndex + ITEMS_PER_PAGE).map(d => d.id);
  }, [filteredDevices, currentPage, view]);

  // Subscribe to real-time metrics for visible devices
  useDevicesMetricsSubscription(visibleDeviceIds);

  // Pagination calculations
  const totalPages = Math.ceil(filteredDevices.length / ITEMS_PER_PAGE);
  const paginatedDevices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDevices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDevices, currentPage]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Handle fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsPageFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        setFullscreenCardIndex(-1);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Global keyboard shortcuts
  useKeyMap([
    {
      key: 'f',
      action: () => toggleFullscreen(pageRef.current),
      description: 'Toggle page fullscreen',
    },
    {
      key: 'Escape',
      action: () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        setFullscreenCardIndex(-1);
        setShowHelp(false);
      },
      description: 'Exit fullscreen / Close help',
    },
    {
      key: '?',
      action: () => setShowHelp(prev => !prev),
      description: 'Toggle keyboard shortcuts help',
    },
  ]);

  // Card-specific fullscreen shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && fullscreenCardIndex >= 0) {
        e.preventDefault();
        const cardElement = document.getElementById(`device-card-${paginatedDevices[fullscreenCardIndex]?.id}`);
        if (cardElement) {
          toggleFullscreen(cardElement);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenCardIndex, paginatedDevices]);

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleCardFullscreen = (index: number) => {
    setFullscreenCardIndex(index);
    const cardElement = document.getElementById(`device-card-${paginatedDevices[index]?.id}`);
    if (cardElement) {
      toggleFullscreen(cardElement);
    }
  };

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

  return (
    <div ref={pageRef} className={`${isPageFullscreen ? 'bg-background p-8' : ''}`}>
      <div className={`${isPageFullscreen ? 'container mx-auto' : ''}`}>
        <div className="container mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{t('common.devices')}</h1>
            
            <div className="flex items-center gap-4">
              <FullscreenButton 
                onClick={() => toggleFullscreen(pageRef.current)}
                isFullscreen={isPageFullscreen}
              />
              <div className="flex items-center gap-2">
                <Button
                  variant={view === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('grid')}
                >
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  {t('devices.viewGrid')}
                </Button>
                <Button
                  variant={view === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('table')}
                >
                  <TableIcon className="h-4 w-4 mr-2" />
                  {t('devices.viewTable')}
                </Button>
              </div>
            </div>
          </div>

          {/* Info bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted-foreground bg-muted p-3 rounded-lg">
            <span>Manage and monitor all devices</span>
            <span className="text-primary">Press ? for keyboard shortcuts</span>
          </div>

          <div className="w-full max-w-md">
            <DeviceSearch value={searchQuery} onChange={setSearchQuery} />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: ITEMS_PER_PAGE }, (_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : (
            <>
              {view === 'grid' ? (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    {paginatedDevices.map((device, index) => (
                      <div 
                        key={device.id}
                        id={`device-card-${device.id}`}
                        className={`relative ${fullscreenCardIndex === index ? 'bg-background' : ''}`}
                      >
                        {fullscreenCardIndex === index && isPageFullscreen && (
                          <div className="absolute top-4 right-4 z-50">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toggleFullscreen(document.getElementById(`device-card-${device.id}`))}
                            >
                              Exit Fullscreen (Esc)
                            </Button>
                          </div>
                        )}
                        <DeviceCardWithMetrics
                          device={device}
                          onClick={() => handleDeviceClick(device)}
                          isFullscreen={fullscreenCardIndex === index}
                        />
                        {/* Fullscreen hint */}
                        <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => handleCardFullscreen(index)}
                          >
                            Press Enter for fullscreen
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredDevices.length)} of {filteredDevices.length} devices
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePreviousPage}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                        <span className="text-sm text-muted-foreground px-2">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <DeviceTable devices={filteredDevices} dragHandle="always" />
              )}
            </>
          )}

          {!isLoading && filteredDevices.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No devices found
            </div>
          )}

          {/* Device Detail Modal with Real-time Data */}
          <DeviceDetailModalWrapper
            device={selectedDevice}
            isOpen={!!selectedDevice}
            onClose={() => setSelectedDevice(null)}
          />
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <KeymapHelp
        open={showHelp}
        onOpenChange={setShowHelp}
        keymaps={[
          { key: 'F', description: 'Toggle page fullscreen' },
          { key: 'Enter', description: 'Toggle focused card fullscreen' },
          { key: 'Esc', description: 'Exit fullscreen / Close help' },
          { key: '?', description: 'Toggle this help' },
        ]}
      />
    </div>
  );
};
