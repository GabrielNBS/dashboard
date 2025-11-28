'use client';

import React, { useRef, useImperativeHandle, forwardRef, useEffect, useState, memo } from 'react';

interface LordIconProps {
  src: string;
  width?: number;
  height?: number;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
  colors?: {
    primary: string;
    secondary: string;
  };
}

export interface LordIconRef {
  play: () => void;
  pause: () => void;
  reset: () => void;
}

const LordIcon = memo(
  forwardRef<LordIconRef, LordIconProps>(
    (
      {
        src,
        width = 24,
        height = 24,
        className = '',
        isActive = false,
        isHovered = false,
        colors: customColors,
      },
      ref
    ) => {
      const iconRef = useRef<HTMLElement>(null);
      const [isLoaded, setIsLoaded] = useState(false);
      const [internalHover, setInternalHover] = useState(false);
      const [isMounted, setIsMounted] = useState(false);

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
            const timeoutId = setTimeout(checkLordIcon, 100);
            return () => clearTimeout(timeoutId);
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

      // Trigger animation when hover state changes
      const shouldPlay = isHovered || internalHover;

      useEffect(() => {
        if (isActive) return; // Se estiver ativo, o loop é controlado pelo trigger nativo

        if (iconRef.current) {
          const icon = iconRef.current as any;

          if (shouldPlay) {
            if (icon.play) icon.play();
          } else {
            // Quando o hover termina, para e volta ao início
            if (icon.stop) icon.stop();
            if (icon.goToFrame) icon.goToFrame(0);
          }
        }
      }, [shouldPlay, isActive]);

      // Determine colors based on state
      const getColors = () => {
        // Se cores customizadas foram fornecidas, use-as
        if (customColors) {
          return customColors;
        }

        if (isActive) {
          return {
            primary: '#ffffff',
            secondary: '#ffffff',
          };
        } else if (shouldPlay) {
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
          return undefined; // Desativa trigger nativo para controle manual via hover
        }
      };

      return React.createElement('lord-icon', {
        ref: iconRef,
        src: src,
        trigger: getTrigger(),
        colors: `primary:${colors.primary},secondary:${colors.secondary}`,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          display: 'block',
          pointerEvents: 'auto', // Permitir eventos de mouse
          cursor: 'pointer',
        },
        className: className,
        onMouseEnter: () => setInternalHover(true),
        onMouseLeave: () => setInternalHover(false),
      });
    }
  )
);

LordIcon.displayName = 'LordIcon';

export default LordIcon;
