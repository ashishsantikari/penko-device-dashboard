import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { Device } from '@/types/device';
import { DeviceCard } from './DeviceCard';

interface DraggableDeviceCardProps {
  device: Device;
  dragHandle: 'hover' | 'always';
}

export const DraggableDeviceCard: React.FC<DraggableDeviceCardProps> = ({ 
  device, 
  dragHandle 
}) => {
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

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {dragHandle === 'always' && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 cursor-grab active:cursor-grabbing z-10"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
      {dragHandle === 'hover' && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 cursor-grab active:cursor-grabbing z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
      <div className={dragHandle === 'hover' ? 'group' : ''}>
        <DeviceCard device={device} />
      </div>
    </div>
  );
};
