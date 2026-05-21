import { useRef, useEffect } from 'react';

/**
 * Custom hook to handle real-time vertical canvas resizing.
 * Extracted from Canvas.jsx to decouple DOM/mouse coordinates calculation.
 */
export default function useCanvasResizer(frameRef, bodyRef, actions, canvasHeight) {
  const dragInfoRef = useRef({ startY: 0, startHeight: 0, newHeight: 0 });
  const isResizingRef = useRef(false);
  const resizeLoopRef = useRef(null);
  const mousePosRef = useRef({ clientY: 0 });

  // Sync canvas height from settings directly when not actively dragging
  useEffect(() => {
    if (frameRef.current && !isResizingRef.current) {
      frameRef.current.style.height = `${canvasHeight}px`;
    }
  }, [canvasHeight, frameRef]);

  // Cleanup: cancel rAF loop and remove listeners if Canvas unmounts mid-resize
  useEffect(() => {
    return () => {
      isResizingRef.current = false;
      if (resizeLoopRef.current) cancelAnimationFrame(resizeLoopRef.current);
      document.removeEventListener('mousemove', handleResizeMouseMove);
      document.removeEventListener('mouseup', handleResizeMouseUp);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleResizeMouseMove(e) {
    mousePosRef.current = { clientY: e.clientY };
  }

  function handleResizeMouseUp() {
    isResizingRef.current = false;
    if (resizeLoopRef.current) {
      cancelAnimationFrame(resizeLoopRef.current);
    }

    document.removeEventListener('mousemove', handleResizeMouseMove);
    document.removeEventListener('mouseup', handleResizeMouseUp);

    if (frameRef.current) {
      frameRef.current.classList.remove('resizing');
    }

    // Single history save to store!
    actions.updateCanvasSettings({
      canvasHeight: dragInfoRef.current.newHeight,
    });
  }

  function handleResizeMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    // Select the canvas container so settings are visible during resize if desired
    actions.deselect();

    isResizingRef.current = true;

    const startScrollTop = bodyRef.current ? bodyRef.current.scrollTop : 0;
    dragInfoRef.current = {
      startY: e.clientY,
      startHeight: frameRef.current.offsetHeight,
      newHeight: frameRef.current.offsetHeight,
      startScrollTop,
    };
    mousePosRef.current = { clientY: e.clientY };

    const updateResize = () => {
      if (!isResizingRef.current) return;

      const { startY, startHeight, startScrollTop } = dragInfoRef.current;
      const container = bodyRef.current;
      
      if (container) {
        const rect = container.getBoundingClientRect();
        const bottomThreshold = rect.bottom - 45;
        const currentY = mousePosRef.current.clientY;

        if (currentY > bottomThreshold) {
          const overflow = currentY - bottomThreshold;
          // Continuous scroll: speed is proportional to drag depth
          const scrollAmount = Math.min(15, overflow * 0.3);
          container.scrollTop += scrollAmount;
        }
      }

      const currentScrollTop = container ? container.scrollTop : 0;
      const deltaScroll = currentScrollTop - startScrollTop;
      const deltaY = mousePosRef.current.clientY - startY;

      // Height combines mouse movement delta and container scroll offset delta
      const newHeight = Math.max(350, startHeight + deltaY + deltaScroll);
      dragInfoRef.current.newHeight = newHeight;

      if (frameRef.current) {
        frameRef.current.style.height = `${newHeight}px`;
      }

      resizeLoopRef.current = requestAnimationFrame(updateResize);
    };

    resizeLoopRef.current = requestAnimationFrame(updateResize);

    document.addEventListener('mousemove', handleResizeMouseMove);
    document.addEventListener('mouseup', handleResizeMouseUp);
    frameRef.current.classList.add('resizing');
  }

  return { handleResizeMouseDown };
}
