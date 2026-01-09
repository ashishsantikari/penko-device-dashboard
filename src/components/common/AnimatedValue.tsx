import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedValueProps {
  value: number | string;
  formatValue?: (val: number | string) => string;
  className?: string;
  animationDuration?: number;
}

export const AnimatedValue: React.FC<AnimatedValueProps> = ({
  value,
  formatValue = (val) => String(val),
  className = '',
  animationDuration = 600,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    // Check if value actually changed
    if (prevValueRef.current !== value) {
      setIsAnimating(true);
      setDisplayValue(value);

      // Remove animation class after duration
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, animationDuration);

      prevValueRef.current = value;

      return () => clearTimeout(timer);
    }
  }, [value, animationDuration]);

  return (
    <span
      className={cn(
        'inline-block transition-all duration-300',
        isAnimating && 'animate-pulse-highlight',
        className
      )}
    >
      {formatValue(displayValue)}
    </span>
  );
};
