'use client';

import React, { useRef, useImperativeHandle, forwardRef, useEffect, useState } from 'react';

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
  reset: () => void;
}

const LordIcon = forwardRef<LordIconRef, LordIconProps>(
  ({ src, width = 24, height = 24, className = '', isActive = false, isHovered = false }, ref) => {
    const iconRef = useRef<HTMLElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [key, setKey] = useState(0); // Para forçar re-render

    // Garantir que o componente só renderiza no cliente
    useEffect(() => {
      setIsMounted(true);
    }, []);

    useEffect(() => {
      if (!isMounted) return;

      // Verificar se o LordIcon foi carregado
      const checkLordIcon = () => {
        if (
          typeof window !== 'undefined' &&
          window.customElements &&
          window.customElements.get('lord-icon')
        ) {
          setIsLoaded(true);
        } else {
          // Tentar novamente após um pequeno delay
          setTimeout(checkLordIcon, 100);
        }
      };

      checkLordIcon();
    }, [isMounted]);

    useImperativeHandle(ref, () => ({
      play: () => {
        if (iconRef.current && 'play' in iconRef.current) {
          (iconRef.current as { play: () => void }).play();
        }
      },
      pause: () => {
        if (iconRef.current && 'pause' in iconRef.current) {
          (iconRef.current as { pause: () => void }).pause();
        }
      },
      reset: () => {
        if (iconRef.current && 'reset' in iconRef.current) {
          (iconRef.current as { reset: () => void }).reset();
        }
      },
    }));

    // Forçar re-render quando sair do estado ativo
    useEffect(() => {
      if (!isActive) {
        setKey(prev => prev + 1);
      }
    }, [isActive]);

    // Trigger animation when hover state changes
    useEffect(() => {
      if (isHovered && iconRef.current && 'play' in iconRef.current) {
        (iconRef.current as { play: () => void }).play();
      }
    }, [isHovered]);

    // Determine colors based on state
    const getColors = () => {
      if (isActive) {
        return {
          primary: '#ffffff',
          secondary: '#ffffff',
        };
      } else if (isHovered) {
        return {
          primary: 'hsl(var(--foreground))',
          secondary: 'hsl(var(--foreground))',
        };
      } else {
        return {
          primary: 'hsl(var(--muted-foreground))',
          secondary: 'hsl(var(--muted-foreground))',
        };
      }
    };

    const colors = getColors();

    // Não renderizar nada no servidor para evitar hidration mismatch
    if (!isMounted) {
      return (
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: 'transparent',
            borderRadius: '2px',
          }}
          className={className}
        />
      );
    }

    // Fallback enquanto o LordIcon não carrega
    if (!isLoaded) {
      return (
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: colors.primary,
            borderRadius: '2px',
            opacity: 0.3,
          }}
          className={className}
        />
      );
    }

    // Determine trigger based on state
    const getTrigger = () => {
      if (isActive) {
        return 'loop'; // Animação contínua quando ativo
      } else {
        return 'hover'; // Animação no hover (detecta hover do elemento pai)
      }
    };

    return React.createElement('lord-icon', {
      key: key, // Força re-render completo
      ref: iconRef,
      src: src,
      trigger: getTrigger(),
      colors: `primary:${colors.primary},secondary:${colors.secondary}`,
      style: {
        width: `${width}px`,
        height: `${height}px`,
        display: 'block',
        pointerEvents: 'none',
      },
      className: className,
    });
  }
);

LordIcon.displayName = 'LordIcon';

export default LordIcon;
