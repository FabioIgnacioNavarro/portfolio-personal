import { useRef, useCallback } from 'react';
import { TASKBAR_HEIGHT_PX } from '@/lib/windowGeometry';

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

interface Size {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

interface UseResizableOptions {
  position: Position;
  size: Size;
  minSize?: Size;
  isMaximized?: boolean;
  onResize: (newSize: Size, newPos: Position) => void;
}

export function useResizable({
  position,
  size,
  minSize = { width: 340, height: 220 },
  isMaximized = false,
  onResize,
}: UseResizableOptions) {
  const isResizingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const resizeStateRef = useRef<{
    direction: ResizeDirection;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startPosX: number;
    startPosY: number;
  } | null>(null);

  const startResize = useCallback(
    (direction: ResizeDirection) => (e: React.PointerEvent) => {
      if (e.button !== 0 || isMaximized) return;

      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);

      isResizingRef.current = true;
      resizeStateRef.current = {
        direction,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: size.width,
        startHeight: size.height,
        startPosX: position.x,
        startPosY: position.y,
      };
    },
    [size, position, isMaximized],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isResizingRef.current || !resizeStateRef.current || isMaximized) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      if (rafIdRef.current !== null) return;

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        if (!isResizingRef.current || !resizeStateRef.current) return;

        const { direction, startX, startY, startWidth, startHeight, startPosX, startPosY } =
          resizeStateRef.current;

        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let newPosX = startPosX;
        let newPosY = startPosY;

        const maxViewportWidth = Math.max(minSize.width, window.innerWidth - 8);
        const maxViewportHeight = Math.max(
          minSize.height,
          window.innerHeight - TASKBAR_HEIGHT_PX - 8,
        );

        // Redimensionamiento horizontal dentro de límites visibles manteniendo fijo el borde opuesto
        if (direction.includes('e')) {
          const clampedWidth = Math.min(startWidth + deltaX, window.innerWidth - startPosX - 4);
          newWidth = Math.max(minSize.width, Math.min(maxViewportWidth, clampedWidth));
        } else if (direction.includes('w')) {
          const anchoredRight = startPosX + startWidth;
          const clampedLeft = Math.max(
            0,
            Math.min(startPosX + deltaX, anchoredRight - minSize.width),
          );
          const boundedWidth = Math.min(maxViewportWidth, anchoredRight - clampedLeft);
          newWidth = Math.max(minSize.width, boundedWidth);
          newPosX = anchoredRight - newWidth;
        }

        // Redimensionamiento vertical evitando que la barra de título suba fuera del viewport (y >= 0)
        if (direction.includes('s')) {
          const clampedHeight = Math.min(
            startHeight + deltaY,
            window.innerHeight - TASKBAR_HEIGHT_PX - startPosY,
          );
          newHeight = Math.max(minSize.height, Math.min(maxViewportHeight, clampedHeight));
        } else if (direction.includes('n')) {
          const anchoredBottom = startPosY + startHeight;
          const clampedTop = Math.max(
            0,
            Math.min(startPosY + deltaY, anchoredBottom - minSize.height),
          );
          const boundedHeight = Math.min(maxViewportHeight, anchoredBottom - clampedTop);
          newHeight = Math.max(minSize.height, boundedHeight);
          newPosY = anchoredBottom - newHeight;
        }

        onResize({ width: newWidth, height: newHeight }, { x: newPosX, y: newPosY });
      });
    },
    [minSize, isMaximized, onResize],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (isResizingRef.current) {
      isResizingRef.current = false;
      resizeStateRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignorar si la captura ya fue liberada
      }
    }
  }, []);

  return {
    startResize,
    handlePointerMove,
    handlePointerUp,
  };
}
