'use client';

import React, { useRef, useImperativeHandle, forwardRef } from 'react';

interface LordIconProps {
  src: string;
  width?: number;
  height?: number;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export interface LordIconRef {
  play: () => void;
  pause: () => void;
}

const LordIcon = forwardRef<LordIconRef, LordIconProps>(
  ({ src, width = 24, height = 24, className = '', isActive = false, isHovered = false }, ref) => {
    const iconRef = useRef<HTMLElement>(null);

    useImperativeHandle(ref, () => ({
      play: () => {
        if (iconRef.current && (iconRef.current as any).play) {
          (iconRef.current as any).play();
        }
      },
      pause: () => {
        if (iconRef.current && (iconRef.current as any).pause) {
          (iconRef.current as unknown).pause();
        }
      },
    }));

    // Determine colors based on state
    const getColors = () => {
      if (isActive) {
        return {
          primary: '#ffffff',
          secondary: '#ffffff',
        };
      } else if (isHovered) {
        return {
          primary: '#374151', // gray-700
          secondary: '#374151',
        };
      } else {
        return {
          primary: '#6b7280', // gray-500
          secondary: '#6b7280',
        };
      }
    };

    const colors = getColors();

    return React.createElement('lord-icon', {
      ref: iconRef,
      src: src,
      trigger: 'hover',
      colors: `primary:${colors.primary},secondary:${colors.secondary}`,
      style: { width: `${width}px`, height: `${height}px` },
      className: className,
    });
  }
);

LordIcon.displayName = 'LordIcon';

export default LordIcon;
