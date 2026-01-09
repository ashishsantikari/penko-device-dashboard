import React, { useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import type { Device } from '@/types/device';
import { DraggableDeviceCard } from './DraggableDeviceCard';
import { useDeviceOrder } from '@/hooks/useDeviceOrder';

interface DraggableDeviceGridProps {
  devices: Device[];
  columns?: number;
  dragHandle?: 'hover' | 'always';
}

export const DraggableDeviceGrid: React.FC<DraggableDeviceGridProps> = ({ 
  devices,
  columns = 3,
  dragHandle = 'hover' 
}) => {
  const [order, setOrder] = useDeviceOrder('grid');

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
      <SortableContext items={order} strategy={rectSortingStrategy}>
        <div 
          className="grid gap-3" 
          style={{ 
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` 
          }}
        >
          {sortedDevices.map((device) => (
            <DraggableDeviceCard 
              key={device.id} 
              device={device} 
              dragHandle={dragHandle}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
