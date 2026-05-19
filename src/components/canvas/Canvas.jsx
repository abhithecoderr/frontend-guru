// components/canvas/Canvas.jsx
import React, { useRef, useEffect } from 'react';
import { useBuilder } from '../../store/BuilderContext.jsx';
import NodeRenderer from './NodeRenderer.jsx';
import { getDefinition } from '../../registry/index.js';

export default function Canvas() {
  const { state, activeTree, activePage, actions } = useBuilder();
  const frameRef = useRef(null);
  const bodyRef = useRef(null);
  const dragInfoRef = useRef({ startY: 0, startHeight: 0, newHeight: 0 });
  const isResizingRef = useRef(false);
  const resizeLoopRef = useRef(null);
  const mousePosRef = useRef({ clientY: 0 });

  const frameClass = `canvas-frame canvas-frame--${state.viewport}`;

  // Get current page settings (fall back to safe values)
  const settings = activePage?.settings || {
    bgColor: '#ffffff',
    fontFamily: 'Inter',
    paddingTop: 40,
    paddingBottom: 40,
    canvasHeight: 650,
  };

  // Sync canvas height from settings directly when not actively dragging
  useEffect(() => {
    if (frameRef.current && !isResizingRef.current) {
      frameRef.current.style.height = `${settings.canvasHeight}px`;
    }
  }, [settings.canvasHeight]);

  // ── Canvas-level drag-and-drop helpers ────────────────
  const onFrameDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onFrameDrop = (e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/x-builder');
    if (!raw) return;
    try {
      const { source, value } = JSON.parse(raw);

      if (source === 'sidebar') {
        const rect = frameRef.current.getBoundingClientRect();
        const def = getDefinition(value);
        const isLayout = def?.group === 'Layout Components';

        const dropX = Math.round(e.clientX - rect.left - 175); // center default width (350/2)
        const dropY = Math.round(e.clientY - rect.top - 60);  // center default height (120/2)

        const defaultWidth = 350;
        const defaultHeight = 120;
        const maxLeft = Math.max(10, rect.width - defaultWidth - 10);
        const maxTop = Math.max(10, rect.height - defaultHeight - 10);

        actions.addNode({
          parentId: null,
          afterId: '__append__',
          componentType: value,
          initialProps: {
            left: isLayout ? 0 : Math.max(10, Math.min(maxLeft, dropX)),
            top: Math.max(10, Math.min(maxTop, dropY)),
            width: isLayout ? 0 : 350,
            height: isLayout ? 0 : 120,
          }
        });
      }
    } catch { /* ignore */ }
  };

  const handleCanvasClick = (e) => {
    // If clicking blank space in frame or scroll body, deselect all nodes
    // which triggers the Canvas Settings Panel in inspector
    if (
      e.target === e.currentTarget ||
      e.target.classList.contains('canvas-frame') ||
      e.target.classList.contains('canvas-body')
    ) {
      actions.deselect();
    }
  };

  // ── Custom JS Mouse Resize Engine ──
  const handleResizeMouseDown = (e) => {
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
  };

  const handleResizeMouseMove = (e) => {
    mousePosRef.current = { clientY: e.clientY };
  };

  const handleResizeMouseUp = () => {
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
  };

  return (
    <div
      ref={bodyRef}
      className="canvas-body"
      onClick={handleCanvasClick}
    >
      <div
        ref={frameRef}
        className={frameClass}
        onClick={handleCanvasClick}
        onDragOver={onFrameDragOver}
        onDrop={onFrameDrop}
        style={{
          backgroundColor: settings.bgColor,
          fontFamily: settings.fontFamily === 'sans-serif' ? 'inherit' : `"${settings.fontFamily}", sans-serif`,
        }}
      >
        {activeTree.length === 0 ? (
          <div className="canvas-empty">
            <span className="canvas-empty__icon">⊕</span>
            <span className="canvas-empty__title">Drag & drop anywhere</span>
            <span className="canvas-empty__sub">Drag any component from the left panel and drop it anywhere on the canvas</span>
          </div>
        ) : (
          <>
            {activeTree.map((node) => (
              <NodeRenderer key={node.id} node={node} parentId={null} />
            ))}
          </>
        )}

        {/* ── Custom Vertical Resizer Handle Bar ── */}
        <div
          className="canvas-vertical-resizer"
          onMouseDown={handleResizeMouseDown}
          title="Drag down to extend canvas height visually"
        >
          <div className="resizer-pill" />
        </div>
      </div>
    </div>
  );
}
