import React from 'react';
import { cn } from '@/lib/utils';

interface SevenSegmentDigitProps {
  digit: string;
  className?: string;
  dotted?: boolean;
}

const segmentMap: Record<string, number[]> = {
  '0': [1, 1, 1, 1, 1, 1, 0],
  '1': [0, 1, 1, 0, 0, 0, 0],
  '2': [1, 1, 0, 1, 1, 0, 1],
  '3': [1, 1, 1, 1, 0, 0, 1],
  '4': [0, 1, 1, 0, 0, 1, 1],
  '5': [1, 0, 1, 1, 0, 1, 1],
  '6': [1, 0, 1, 1, 1, 1, 1],
  '7': [1, 1, 1, 0, 0, 0, 0],
  '8': [1, 1, 1, 1, 1, 1, 1],
  '9': [1, 1, 1, 1, 0, 1, 1],
  '-': [0, 0, 0, 0, 0, 0, 1],
  '.': [0, 0, 0, 0, 0, 0, 0],
  ' ': [0, 0, 0, 0, 0, 0, 0],
};

const SevenSegmentDigit: React.FC<SevenSegmentDigitProps> = ({ digit, className, dotted = false }) => {
  const segments = segmentMap[digit] || segmentMap[' '];
  
  // When dotted, use stroke instead of fill
  const segmentProps = dotted ? {
    fill: 'transparent',
    stroke: 'currentColor',
    strokeWidth: 4,
    strokeDasharray: '4,4',
    opacity: 1,
  } : {
    fill: 'currentColor',
    stroke: 'none',
    opacity: 1,
  };
  
  const inactiveProps = {
    fill: 'transparent',
    stroke: 'currentColor',
    strokeWidth: 2,
    opacity: 0.1,
  };
  
  return (
    <svg
      viewBox="0 0 60 100"
      className={cn("w-full h-full", className)}
      style={{ minWidth: '30px' }}
    >
      <defs>
        {/* Define segment paths for reuse */}
        <polygon id="seg-top" points="10,5 15,0 45,0 50,5 45,10 15,10" />
        <polygon id="seg-top-right" points="50,5 55,10 55,45 50,50 45,45 45,10" />
        <polygon id="seg-bottom-right" points="50,50 55,55 55,90 50,95 45,90 45,55" />
        <polygon id="seg-bottom" points="10,95 15,90 45,90 50,95 45,100 15,100" />
        <polygon id="seg-bottom-left" points="10,50 15,55 15,90 10,95 5,90 5,55" />
        <polygon id="seg-top-left" points="10,5 15,10 15,45 10,50 5,45 5,10" />
        <polygon id="seg-middle" points="10,48 15,45 45,45 50,48 45,51 15,51" />
      </defs>
      
      {/* Top */}
      <use 
        href="#seg-top" 
        {...(segments[0] ? segmentProps : inactiveProps)}
        className={segments[0] ? (dotted ? '' : 'text-red-500') : 'text-gray-800'}
      />
      {/* Top Right */}
      <use 
        href="#seg-top-right" 
        {...(segments[1] ? segmentProps : inactiveProps)}
        className={segments[1] ? (dotted ? '' : 'text-red-500') : 'text-gray-800'}
      />
      {/* Bottom Right */}
      <use 
        href="#seg-bottom-right" 
        {...(segments[2] ? segmentProps : inactiveProps)}
        className={segments[2] ? (dotted ? '' : 'text-red-500') : 'text-gray-800'}
      />
      {/* Bottom */}
      <use 
        href="#seg-bottom" 
        {...(segments[3] ? segmentProps : inactiveProps)}
        className={segments[3] ? (dotted ? '' : 'text-red-500') : 'text-gray-800'}
      />
      {/* Bottom Left */}
      <use 
        href="#seg-bottom-left" 
        {...(segments[4] ? segmentProps : inactiveProps)}
        className={segments[4] ? (dotted ? '' : 'text-red-500') : 'text-gray-800'}
      />
      {/* Top Left */}
      <use 
        href="#seg-top-left" 
        {...(segments[5] ? segmentProps : inactiveProps)}
        className={segments[5] ? (dotted ? '' : 'text-red-500') : 'text-gray-800'}
      />
      {/* Middle */}
      <use 
        href="#seg-middle" 
        {...(segments[6] ? segmentProps : inactiveProps)}
        className={segments[6] ? (dotted ? '' : 'text-red-500') : 'text-gray-800'}
      />
      
      {/* Decimal point */}
      {digit === '.' && (
        <circle 
          cx="55" 
          cy="95" 
          r="4" 
          className="text-red-500"
          {...(dotted ? { 
            stroke: 'currentColor', 
            strokeWidth: 2, 
            strokeDasharray: '2,2', 
            fill: 'transparent' 
          } : { 
            fill: 'currentColor' 
          })}
        />
      )}
    </svg>
  );
};

interface DigitalDisplayProps {
  value: number;
  decimals?: number;
  unit?: string;
  label?: string;
  className?: string;
  isOffline?: boolean;
  status?: 'active' | 'idle' | 'error' | 'maintenance';
}

export const DigitalDisplay: React.FC<DigitalDisplayProps> = ({
  value,
  decimals = 2,
  unit = 'kg',
  label,
  className,
  isOffline = false,
  status = 'active',
}) => {
  const formattedValue = value.toFixed(decimals);
  const digits = formattedValue.split('');
  
  // Show dotted lines for offline or idle devices
  const showDotted = isOffline || status === 'idle';
  
  const getStatusColor = () => {
    if (isOffline) return 'text-gray-500';
    switch (status) {
      case 'error':
      case 'maintenance':
        return 'text-yellow-500';
      case 'idle':
        return 'text-blue-400';
      default:
        return 'text-red-500';
    }
  };

  return (
    <div className={cn(
      "relative bg-black rounded-lg p-4 border-2",
      isOffline ? "border-gray-700" : "border-gray-600",
      className
    )}>
      {/* Label */}
      {label && (
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-mono">
          {label}
        </div>
      )}
      
      {/* Digital Display */}
      <div className="flex items-end justify-center gap-1">
        <div className="flex items-center">
          {digits.map((digit, index) => (
            <div key={index} className="w-6 h-10 md:w-7 md:h-12">
              <SevenSegmentDigit
                digit={digit}
                dotted={showDotted}
                className={cn(
                  "w-full h-full",
                  getStatusColor()
                )}
              />
            </div>
          ))}
        </div>
        
        {/* Unit */}
        <div className={cn(
          "text-sm md:text-base font-mono ml-1 mb-1",
          isOffline ? "text-gray-600" : "text-gray-400"
        )}>
          {unit}
        </div>
      </div>
      
      {/* Status indicator */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            isOffline ? "bg-gray-600" :
            status === 'active' ? "bg-green-500" :
            status === 'idle' ? "bg-blue-400" :
            status === 'error' ? "bg-red-500" :
            "bg-yellow-500"
          )} />
          <span className={cn(
            "text-xs font-mono uppercase",
            isOffline ? "text-gray-500" : "text-gray-400"
          )}>
            {isOffline ? 'OFFLINE' : status}
          </span>
        </div>
        
        {/* Frozen indicator for idle/offline */}
        {(isOffline || status === 'idle') && (
          <div className="text-xs text-gray-500 font-mono">
            FROZEN
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalDisplay;
