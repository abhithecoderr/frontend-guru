// components/canvas/DropZone.jsx
import React from 'react';
import { useDrop } from '../../hooks/useDrop.js';

/**
 * A thin drop target rendered between nodes.
 * @param {string|null} parentId
 * @param {string|null} afterId  - insert after this node id (null = prepend, '__append__' = end)
 * @param {string|null} type     - type of the parent node
 */
export default function DropZone({ parentId = null, afterId = null, type = null }) {
  const { isOver, onDragOver, onDragLeave, onDrop } = useDrop(parentId, afterId);
  const isRow = type === 'FlexRow';

  return (
    <div
      className={`drop-zone ${isRow ? 'drop-zone--row' : 'drop-zone--col'}${isOver ? ' drop-active' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      data-drop-zone="true"
      data-parent-id={parentId || 'null'}
      data-after-id={afterId || 'null'}
      data-parent-type={type || 'null'}
    >
      <div className="drop-preview-outline">
        <span className="drop-preview-outline__icon">📦</span>
        <span className="drop-preview-outline__label">Place here</span>
      </div>
    </div>
  );
}
