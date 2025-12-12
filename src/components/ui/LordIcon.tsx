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

interface LordIconElement extends HTMLElement {
  play?: () => void;
  pause?: () => void;
  reset?: () => void;
  goToFirstFrame?: () => void;
  seek?: (frame: number) => void;
  goToFrame?: (frame: number) => void;
  playerInstance?: {
    goToAndStop?: (frame: number, isFrame?: boolean) => void;
    goToFirstFrame?: () => void;
    pause?: () => void;
    play?: () => void;
  };
  time?: number;
  ready?: Promise<void>;
}

const LordIconInner = (
  {
    src,
    width = 24,
    height = 24,
    className,
    isActive = false,
    isHovered = false,
    colors: customColors,
  }: LordIconProps,
  ref: React.Ref<LordIconRef>
) => {
  const iconRef = useRef<LordIconElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [internalHover, setInternalHover] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Garante que só renderiza "de verdade" no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Verificar se o custom element <lord-icon> já foi registrado
  useEffect(() => {
    if (!isMounted) return;

    if (typeof window === 'undefined' || !('customElements' in window)) {
      return;
    }

    if (window.customElements.get('lord-icon')) {
      setIsLoaded(true);
      return;
    }

    const intervalId = window.setInterval(() => {
      if (window.customElements?.get('lord-icon')) {
        setIsLoaded(true);
        window.clearInterval(intervalId);
      }
    }, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isMounted]);

  useImperativeHandle(
    ref,
    () => ({
      play: () => {
        iconRef.current?.play?.();
      },
      pause: () => {
        iconRef.current?.pause?.();
      },
      reset: () => {
        iconRef.current?.reset?.();
      },
    }),
    []
  );

  const shouldPlay = isHovered || internalHover;

  // Controle manual de animação baseado em hover quando não está em modo "ativo" (loop)
  useEffect(() => {
    if (isActive) return;

    const icon = iconRef.current;
    if (!icon) return;

    if (shouldPlay) {
      // Garantir que o ícone está pronto antes de tocar
      const playIcon = async () => {
        try {
          await icon.ready;
        } catch {
          // Ignora erro se ready não existir
        }
        icon.playerInstance?.play?.() ?? icon.play?.();
      };
      playIcon();
      return;
    }

    // Quando o hover termina, para a animação e volta ao frame inicial
    const resetToFirstFrame = async () => {
      // Primeiro, pausar a animação
      icon.playerInstance?.pause?.() ?? icon.pause?.();

      // Aguardar o ícone estar pronto (para garantir que playerInstance existe)
      try {
        await icon.ready;
      } catch {
        // Ignora se ready não existir
      }

      // Usar playerInstance.goToFirstFrame() como método principal (API oficial)
      if (icon.playerInstance?.goToFirstFrame) {
        icon.playerInstance.goToFirstFrame();
        return;
      }

      // Fallback: usar goToAndStop(0, true) para ir ao frame 0
      if (icon.playerInstance?.goToAndStop) {
        icon.playerInstance.goToAndStop(0, true);
        return;
      }

      // Fallbacks para APIs alternativas
      if (icon.goToFirstFrame) {
        icon.goToFirstFrame();
      } else if (icon.seek) {
        icon.seek(0);
      } else if (icon.goToFrame) {
        icon.goToFrame(0);
      }

      // Último recurso: definir time = 0
      if ('time' in icon && typeof icon.time === 'number') {
        icon.time = 0;
      }
    };

    resetToFirstFrame();

    // Reforçar o reset no próximo frame para garantir consistência
    const rafId = requestAnimationFrame(() => {
      resetToFirstFrame();
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [shouldPlay, isActive]);

  // Definição de cores baseada em estado
  const colors = customColors
    ? customColors
    : isActive
      ? {
          primary: '#ffffff',
          secondary: '#ffffff',
        }
      : shouldPlay
        ? {
            primary: 'hsl(var(--foreground))',
            secondary: 'hsl(var(--foreground))',
          }
        : {
            primary: 'hsl(var(--muted-foreground))',
            secondary: 'hsl(var(--muted-foreground))',
          };

  // Placeholder no servidor / antes do mount para evitar hydration mismatch
  if (!isMounted) {
    return (
      <div
        style={{
          width,
          height,
          backgroundColor: 'transparent',
          borderRadius: 2,
        }}
        className={className}
      />
    );
  }

  // Fallback enquanto o custom element ainda não está disponível
  if (!isLoaded) {
    return (
      <div
        style={{
          width,
          height,
          backgroundColor: colors.primary,
          borderRadius: 2,
          opacity: 0.3,
        }}
        className={className}
      />
    );
  }

  const trigger = isActive ? 'loop' : undefined;

  return React.createElement('lord-icon', {
    ref: iconRef,
    src,
    trigger,
    colors: `primary:${colors.primary},secondary:${colors.secondary}`,
    style: {
      width,
      height,
      display: 'block',
      pointerEvents: 'auto',
      cursor: 'pointer',
    },
    className,
    onMouseEnter: () => setInternalHover(true),
    onMouseLeave: () => setInternalHover(false),
  });
};

const LordIcon = memo(forwardRef<LordIconRef, LordIconProps>(LordIconInner));
LordIcon.displayName = 'LordIcon';

export default LordIcon;
