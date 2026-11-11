import { useRef, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDraggableOptions {
  position: Position;
  isMaximized?: boolean;
  onPositionChange: (newPos: Position) => void;
  onMaximizeToggle?: () => void;
}

export function useDraggable({
  position,
  isMaximized = false,
  onPositionChange,
  onMaximizeToggle,
}: UseDraggableOptions) {
  const isDraggingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const dragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    windowX: number;
    windowY: number;
  }>({
    pointerX: 0,
    pointerY: 0,
    windowX: 0,
    windowY: 0,
  });

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Solo arrastrar con el botón principal del mouse o toque táctil
      if (e.button !== 0 || isMaximized) return;

      // No arrastrar si se hace clic en botones o elementos interactivos de la barra de título
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('input')) {
        return;
      }

      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);

      isDraggingRef.current = true;
      dragStartRef.current = {
        pointerX: e.clientX,
        pointerY: e.clientY,
        windowX: position.x,
        windowY: position.y,
      };
    },
    [position, isMaximized],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current || isMaximized) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      if (rafIdRef.current !== null) return;

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        if (!isDraggingRef.current) return;

        const deltaX = clientX - dragStartRef.current.pointerX;
        const deltaY = clientY - dragStartRef.current.pointerY;

        // Limitar las coordenadas para que la barra de título no salga completamente de la pantalla
        const newX = Math.max(
          -200,
          Math.min(window.innerWidth - 100, dragStartRef.current.windowX + deltaX),
        );
        const newY = Math.max(
          0,
          Math.min(window.innerHeight - 100, dragStartRef.current.windowY + deltaY),
        );

        onPositionChange({ x: newX, y: newY });
      });
    },
    [onPositionChange, isMaximized],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // La captura de puntero puede haberse liberado previamente
      }
    }
  }, []);

  const handleDoubleClick = useCallback(() => {
    if (onMaximizeToggle) {
      onMaximizeToggle();
    }
  }, [onMaximizeToggle]);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick,
  };
}
