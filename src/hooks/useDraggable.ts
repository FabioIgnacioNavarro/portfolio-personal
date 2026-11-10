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
      // Only drag with primary mouse button / touch
      if (e.button !== 0 || isMaximized) return;

      // Don't drag if clicking buttons or interactive elements inside title bar
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

      const deltaX = e.clientX - dragStartRef.current.pointerX;
      const deltaY = e.clientY - dragStartRef.current.pointerY;

      // Clamp so window title bar cannot be completely dragged off-screen
      const newX = Math.max(
        -200,
        Math.min(window.innerWidth - 100, dragStartRef.current.windowX + deltaX),
      );
      const newY = Math.max(
        0,
        Math.min(window.innerHeight - 100, dragStartRef.current.windowY + deltaY),
      );

      onPositionChange({ x: newX, y: newY });
    },
    [onPositionChange, isMaximized],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture may have already been released
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
