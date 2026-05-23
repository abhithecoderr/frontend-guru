// components/canvas/NodeRenderer.jsx
import React from 'react';
import { useBuilder } from '../../store/BuilderContext.jsx';
import { getDefinition, RENDERERS } from '../../registry/index.js';
import { findNodeInTree, countNodes } from '../../utils/treeUtils.js';
import useNodeResizer from '../../hooks/useNodeResizer.js';
import useNodeDrag from '../../hooks/useNodeDrag.js';

export default function NodeRenderer({ node, parentId = null }) {
  const { state, actions, activeTree } = useBuilder();
  const isSelected = state.selectedNodeId === node.id;
  const def = getDefinition(node.type);
  const Renderer = RENDERERS[node.type];
  const wrapperRef = React.useRef(null);

  if (!Renderer || !def) {
    return <div className="node-renderer-unknown">Unknown: {node.type}</div>;
  }

  const isLayout = def?.group === 'Layout Components';

  const left = node.props?.left ?? 50;
  const top  = node.props?.top  ?? 50;

  const parentNode = parentId ? findNodeInTree(activeTree, parentId) : null;
  const currentSlotIndex = node.props.slotIndex;
  const slotProps = (parentNode && currentSlotIndex !== undefined)
    ? parentNode.props.slotsProps?.[currentSlotIndex]
    : null;

  const slotAlignX = slotProps?.alignX || parentNode?.props?.defaultSlotAlignX || 'none';
  const slotAlignY = slotProps?.alignY || parentNode?.props?.defaultSlotAlignY || 'none';
  const isAligned  = slotAlignX !== 'none' || slotAlignY !== 'none';

  // Custom hooks for drag and resize
  const { handleResizeStart } = useNodeResizer(node, wrapperRef, actions);
  const { handleMouseDown }   = useNodeDrag(
    node, parentId, wrapperRef, activeTree, actions, isAligned, isLayout, isSelected
  );

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isLayout) actions.selectNode(node.id);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (isLayout) actions.selectNode(node.id);
  };

  const widthVal  = node.props?.width;
  const heightVal = node.props?.height;
  const minHeightVal = node.props?.minHeight;

  const isFullWidth  = isLayout && (widthVal === 0 || widthVal === undefined);
  const widthStyle   = isFullWidth ? '100%' : (widthVal ? `${widthVal}px` : '350px');
  const heightStyle  = heightVal === 0 ? 'auto' : (heightVal ? `${heightVal}px` : 'auto');
  const minHeightStyle = minHeightVal !== undefined ? `${minHeightVal}px` : undefined;

  const currentZ = node.props.zIndex !== undefined ? node.props.zIndex : 1;

  // Cursor: show grab when selected and draggable, default otherwise
  const cursorStyle = isSelected ? 'grab' : 'default';

  const hasFixedHeight = heightVal && heightVal > 0;

  return (
    <div
      ref={wrapperRef}
      className={`node-wrapper${isSelected ? ' selected' : ''}${isAligned ? ' node-aligned' : ''}${hasFixedHeight ? ' has-fixed-height' : ''}`}
      data-node-id={node.id}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      style={{
        width:     widthStyle,
        height:    heightStyle,
        minHeight: minHeightStyle,
        position:  isAligned ? 'relative' : 'absolute',
        left:      isAligned ? 0 : left,
        top:       isAligned ? 0 : top,
        margin:    0,
        zIndex:    currentZ,
        cursor:    cursorStyle,
      }}
    >
      {/* ── Layer Stacking Controls (only when selected) ── */}
      {isSelected && (() => {
        const maxZ = Math.max(1, countNodes(state.pages.find(p => p.id === state.activePageId)?.tree ?? []));
        return (
          <div className="node-layer-controls">
            <span className="node-layer-controls__badge">L:{currentZ}</span>
            <button
              type="button"
              className="node-layer-controls__btn node-layer-controls__btn--up"
              title="Bring Upward"
              onClick={(e) => {
                e.stopPropagation();
                actions.updateProps(node.id, { zIndex: Math.min(maxZ, currentZ + 1) });
              }}
            >▲</button>
            <button
              type="button"
              className="node-layer-controls__btn node-layer-controls__btn--down"
              title="Move Downward"
              onClick={(e) => {
                e.stopPropagation();
                actions.updateProps(node.id, { zIndex: Math.max(1, currentZ - 1) });
              }}
            >▼</button>
          </div>
        );
      })()}

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

      <Renderer props={node.props} nodeId={node.id}>
        {(node.children || []).map(childNode => (
          <NodeRenderer key={childNode.id} node={childNode} parentId={node.id} />
        ))}
      </Renderer>
    </div>
  );
}
