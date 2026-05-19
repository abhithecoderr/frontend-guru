// components/canvas/NodeRenderer.jsx
import React from 'react';
import Draggable from 'react-draggable';
import { useBuilder } from '../../store/BuilderContext.jsx';
import { getDefinition, RENDERERS } from '../../registry/index.js';

export default function NodeRenderer({ node }) {
  const { state, actions } = useBuilder();
  const isSelected = state.selectedNodeId === node.id;
  const def = getDefinition(node.type);
  const Renderer = RENDERERS[node.type];

  if (!Renderer || !def) {
    return <div style={{ padding: 8, color: 'red', fontSize: 12 }}>Unknown: {node.type}</div>;
  }
  const wrapperRef = React.useRef(null);

  const left = node.props?.left ?? 50;
  const top = node.props?.top ?? 50;

  const handleResizeStart = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = wrapperRef.current ? wrapperRef.current.offsetWidth : (node.props.width || 350);
    const startHeight = wrapperRef.current ? wrapperRef.current.offsetHeight : (node.props.height || 120);

    const parentEl = wrapperRef.current ? wrapperRef.current.parentElement : null;
    const parentWidth = parentEl ? parentEl.offsetWidth : 1280;
    const parentHeight = parentEl ? parentEl.offsetHeight : 650;

    const maxAllowedWidth = Math.max(50, parentWidth - left);
    const maxAllowedHeight = Math.max(20, parentHeight - top);

    let finalWidth = startWidth;
    let finalHeight = startHeight;

    wrapperRef.current?.classList.add('resizing');

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      if (direction === 'e' || direction === 'se') {
        finalWidth = Math.min(maxAllowedWidth, Math.max(50, startWidth + deltaX));
        if (wrapperRef.current) {
          wrapperRef.current.style.width = `${finalWidth}px`;
        }
      }

      if (direction === 's' || direction === 'se') {
        finalHeight = Math.min(maxAllowedHeight, Math.max(20, startHeight + deltaY));
        if (wrapperRef.current) {
          wrapperRef.current.style.height = `${finalHeight}px`;
        }
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      wrapperRef.current?.classList.remove('resizing');

      const newProps = {};
      if (direction === 'e' || direction === 'se') {
        newProps.width = finalWidth;
      }
      if (direction === 's' || direction === 'se') {
        newProps.height = finalHeight;
      }

      actions.updateProps(node.id, newProps);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    actions.selectNode(node.id);
  };

  const isLayout = def?.group === 'Layout Components';
  const widthVal = node.props?.width;
  const heightVal = node.props?.height;

  // Layout components without explicit pixel widths default to full 100% width
  const isFullWidth = isLayout && (widthVal === 0 || widthVal === undefined);

  const widthStyle = isFullWidth 
    ? '100%' 
    : (widthVal ? `${widthVal}px` : '350px');

  const heightStyle = heightVal === 0 
    ? 'auto' 
    : (heightVal ? `${heightVal}px` : 'auto');

  // Full-width layout bands are locked to left: 0 and drag vertically only; content elements drag freely
  const dragAxis = isFullWidth ? 'y' : 'both';
  const actualLeft = isFullWidth ? 0 : left;

  return (
    <Draggable
      key={`${node.id}-${actualLeft}-${top}`}
      nodeRef={wrapperRef}
      axis={dragAxis}
      defaultPosition={{ x: actualLeft, y: top }}
      bounds="parent"
      cancel="button, input, textarea, select, .node-resize-handle, p, h1, h2, h3, span:not(.node-toolbar__drag-handle)"
      onStop={(e, data) => {
        if (data.x !== actualLeft || data.y !== top) {
          actions.updateProps(node.id, { left: data.x, top: data.y });
        }
      }}
    >
      <div
        ref={wrapperRef}
        className={`node-wrapper${isSelected ? ' selected' : ''}`}
        onClick={handleClick}
        style={{
          width: widthStyle,
          height: heightStyle,
          position: 'absolute',
          left: 0,
          top: 0,
          margin: 0,
        }}
      >
        {/* ── Node Toolbar ── */}
        <div className="node-toolbar">
          <span
            className="node-toolbar__drag-handle"
            title="Drag from anywhere, or use this handle to drag"
            style={{ cursor: 'grab' }}
          >
            ⠿
          </span>

          <span className="node-toolbar__label">{def.icon} {def.label}</span>

          <button
            title="Duplicate"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); actions.duplicateNode(node.id); }}
          >⧉</button>

          <button
            className="danger"
            title="Delete (Del)"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); actions.removeNode(node.id); }}
          >✕</button>
        </div>

        {/* ── Interactive Resize Handles (only when selected) ── */}
        {isSelected && (
          <>
            <div
              className="node-resize-handle node-resize-handle--e"
              onMouseDown={(e) => handleResizeStart(e, 'e')}
              title="Drag to resize width"
            />
            <div
              className="node-resize-handle node-resize-handle--s"
              onMouseDown={(e) => handleResizeStart(e, 's')}
              title="Drag to resize height"
            />
            <div
              className="node-resize-handle node-resize-handle--se"
              onMouseDown={(e) => handleResizeStart(e, 'se')}
              title="Drag to resize width and height"
            />
          </>
        )}

        <Renderer props={node.props} />
      </div>
    </Draggable>
  );
}
