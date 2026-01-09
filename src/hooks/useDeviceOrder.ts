import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useDeviceOrder = (view: 'grid' | 'table') => {
  const { user } = useAuth();
  const key = `device-order-${view}-${user?.id || 'guest'}`;

  const [order, setOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (order.length > 0) {
      localStorage.setItem(key, JSON.stringify(order));
    }
  }, [order, key]);

  return [order, setOrder] as const;
};
