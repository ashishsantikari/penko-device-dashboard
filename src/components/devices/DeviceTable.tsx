import React, { useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import type { Device } from '@/types/device';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DeviceStatusIndicator } from './DeviceStatusIndicator';
import { AnimatedValue } from '@/components/common/AnimatedValue';
import { useLatestDeviceMetrics } from '@/hooks/useDeviceData';
import { format } from 'date-fns';
import { useDeviceOrder } from '@/hooks/useDeviceOrder';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, CheckCircle2, XCircle } from 'lucide-react';
import { useLocation } from 'wouter';

interface DraggableRowProps {
  device: Device;
  dragHandle: 'hover' | 'always';
}

const DraggableRow: React.FC<DraggableRowProps> = ({ device, dragHandle }) => {
  const [, setLocation] = useLocation();
  const latestMetrics = useLatestDeviceMetrics(device.id);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: device.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer hover:bg-muted/50 dark:hover:bg-gray-700/50 ${dragHandle === 'hover' ? 'group' : ''}`}
      onClick={() => setLocation(`/devices/${device.id}`)}
    >
      <TableCell className="w-10 py-2 px-2">
        <div
          {...attributes}
          {...listeners}
          className={`cursor-grab active:cursor-grabbing ${
            dragHandle === 'hover' ? 'opacity-0 group-hover:opacity-100 transition-opacity' : ''
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell className="font-mono text-xs w-32 py-2">{device.id}</TableCell>
      <TableCell className="font-medium text-sm w-24 py-2">{device.name}</TableCell>
      <TableCell className="w-24 py-2">
        <DeviceStatusIndicator 
          status={device.connectionStatus}
          deviceStatus={device.status}
          percentage={device.statusPercentage}
          variant="badge"
        />
      </TableCell>
      
      {/* Net Weight - Primary metric */}
      <TableCell className="text-right tabular-nums w-28 py-2">
        {latestMetrics ? (
          <div className="flex items-baseline justify-end gap-0.5">
            <AnimatedValue
              value={latestMetrics.netWeight}
              formatValue={formatWeight}
              className="font-semibold text-sm dark:text-gray-100 px-1 py-0.5 rounded"
            />
            <span className="text-[10px] text-muted-foreground">kg</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">---</span>
        )}
      </TableCell>

      {/* Gross Weight */}
      <TableCell className="text-right tabular-nums w-28 py-2">
        {latestMetrics ? (
          <div className="flex items-baseline justify-end gap-0.5">
            <AnimatedValue
              value={latestMetrics.grossWeight}
              formatValue={formatWeight}
              className="text-sm dark:text-gray-200 px-1 py-0.5 rounded"
            />
            <span className="text-[10px] text-muted-foreground">kg</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">---</span>
        )}
      </TableCell>

      {/* Tare Weight */}
      <TableCell className="text-right tabular-nums w-24 py-2">
        {latestMetrics ? (
          <div className="flex items-baseline justify-end gap-0.5">
            <span className="text-sm dark:text-gray-200">{formatWeight(latestMetrics.tareWeight)}</span>
            <span className="text-[10px] text-muted-foreground">kg</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">---</span>
        )}
      </TableCell>

      {/* Stability */}
      <TableCell className="w-16 py-2 text-center">
        {latestMetrics && (
          <div className="flex items-center justify-center">
            {latestMetrics.isStable ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />
            )}
          </div>
        )}
      </TableCell>

      {/* Temperature */}
      <TableCell className="text-right tabular-nums w-20 py-2">
        {latestMetrics?.temperature !== undefined ? (
          <div className="flex items-baseline justify-end gap-0.5">
            <AnimatedValue
              value={latestMetrics.temperature}
              formatValue={formatTemp}
              className="text-sm dark:text-gray-200 px-1 py-0.5 rounded"
            />
            <span className="text-[10px] text-muted-foreground">°C</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">---</span>
        )}
      </TableCell>

      {/* Load Cells */}
      <TableCell className="text-center w-14 py-2">
        {latestMetrics ? (
          <span className="text-xs">{latestMetrics.loadCellCount}</span>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        )}
      </TableCell>

      {/* Last Update */}
      <TableCell className="text-xs text-muted-foreground w-32 py-2">
        {format(device.lastUpdate, 'HH:mm:ss')}
      </TableCell>
    </TableRow>
  );
};

interface DeviceTableProps {
  devices: Device[];
  dragHandle?: 'hover' | 'always';
}

export const DeviceTable: React.FC<DeviceTableProps> = ({ devices, dragHandle = 'always' }) => {
  const [order, setOrder] = useDeviceOrder('table');

  // Initialize order when devices load
  useEffect(() => {
    if (devices.length > 0 && order.length === 0) {
      setOrder(devices.map(d => d.id));
    }
  }, [devices, order.length, setOrder]);

  // Sort devices based on stored order
  const sortedDevices = React.useMemo(() => {
    if (order.length === 0) return devices;
    
    const ordered = [...devices].sort((a, b) => {
      const aIndex = order.indexOf(a.id);
      const bIndex = order.indexOf(b.id);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
    
    return ordered;
  }, [devices, order]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = order.indexOf(active.id as string);
      const newIndex = order.indexOf(over.id as string);
      setOrder(arrayMove(order, oldIndex, newIndex));
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <div className="border rounded-lg dark:border-gray-700 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-700 dark:hover:bg-gray-800">
                <TableHead className="w-10 py-2 px-2"></TableHead>
                <TableHead className="w-32 py-2 text-xs">Device ID</TableHead>
                <TableHead className="w-24 py-2 text-xs">Name</TableHead>
                <TableHead className="w-24 py-2 text-xs">Status</TableHead>
                <TableHead className="text-right w-28 py-2 text-xs">Net</TableHead>
                <TableHead className="text-right w-28 py-2 text-xs">Gross</TableHead>
                <TableHead className="text-right w-24 py-2 text-xs">Tare</TableHead>
                <TableHead className="w-16 py-2 text-xs text-center">Stable</TableHead>
                <TableHead className="text-right w-20 py-2 text-xs">Temp</TableHead>
                <TableHead className="text-center w-14 py-2 text-xs">Cells</TableHead>
                <TableHead className="w-32 py-2 text-xs">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDevices.map((device) => (
                <DraggableRow key={device.id} device={device} dragHandle={dragHandle} />
              ))}
            </TableBody>
          </Table>
        </div>
      </SortableContext>
    </DndContext>
  );
};
