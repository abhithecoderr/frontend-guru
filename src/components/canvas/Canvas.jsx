// components/canvas/Canvas.jsx
import React, { useRef } from 'react';
import { useBuilder } from '../../store/BuilderContext.jsx';
import NodeRenderer from './NodeRenderer.jsx';
import useCanvasResizer from '../../hooks/useCanvasResizer.js';
import useCanvasDrop from '../../hooks/useCanvasDrop.js';

export default function Canvas() {
  const { state, activeTree, activePage, actions } = useBuilder();
  const frameRef = useRef(null);
  const bodyRef = useRef(null);

  const frameClass = `canvas-frame canvas-frame--${state.viewport}`;

  // Get current page settings (fall back to safe values)
  const settings = activePage?.settings || {
    bgColor: '#ffffff',
    fontFamily: 'Inter',
    paddingTop: 40,
    paddingBottom: 40,
    canvasHeight: 650,
  };

  // Leverage custom modular hooks for resizing and drop operations
  const { handleResizeMouseDown } = useCanvasResizer(frameRef, bodyRef, actions, settings.canvasHeight);
  const { handleDragOver, handleDrop } = useCanvasDrop(frameRef, activeTree, actions);

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
        onDragOver={handleDragOver}
        onDrop={handleDrop}
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
