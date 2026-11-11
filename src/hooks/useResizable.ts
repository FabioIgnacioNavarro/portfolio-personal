import { useRef, useCallback } from 'react';

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

        // Redimensionamiento horizontal
        if (direction.includes('e')) {
          newWidth = Math.max(minSize.width, startWidth + deltaX);
        } else if (direction.includes('w')) {
          const potentialWidth = startWidth - deltaX;
          if (potentialWidth >= minSize.width) {
            newWidth = potentialWidth;
            newPosX = startPosX + deltaX;
          } else {
            newWidth = minSize.width;
            newPosX = startPosX + (startWidth - minSize.width);
          }
        }

        // Redimensionamiento vertical
        if (direction.includes('s')) {
          newHeight = Math.max(minSize.height, startHeight + deltaY);
        } else if (direction.includes('n')) {
          const potentialHeight = startHeight - deltaY;
          if (potentialHeight >= minSize.height) {
            newHeight = potentialHeight;
            newPosY = startPosY + deltaY;
          } else {
            newHeight = minSize.height;
            newPosY = startPosY + (startHeight - minSize.height);
          }
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
