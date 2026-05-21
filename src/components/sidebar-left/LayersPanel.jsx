// components/sidebar-left/LayersPanel.jsx
// Recursive tree view of the canvas node hierarchy

import { useState } from 'react';
import { useBuilder } from '../../store/BuilderContext.jsx';
import { getDefinition } from '../../registry/index.js';
import { countNodes } from '../../utils/treeUtils.js';
import useLayersDnd from '../../hooks/useLayersDnd.js';

function LayerNode({ node, depth = 0 }) {
  const { state, activeTree, actions } = useBuilder();
  const def = getDefinition(node.type);
  const isSelected = state.selectedNodeId === node.id;
  const hasChildren = def?.canHaveChildren && node.children?.length > 0;
  const [collapsed, setCollapsed] = useState(false);

  // Consume custom modular HTML5 drag-and-drop hook
  const {
    isDragOver,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDragEnd,
    handleDrop,
  } = useLayersDnd(node, activeTree, actions);

  // Sort children by zIndex descending
  const sortedChildren = hasChildren
    ? [...node.children].sort((a, b) => (b.props?.zIndex ?? 1) - (a.props?.zIndex ?? 1))
    : [];

  return (
    <div className="layer-node">
      <div
        className={`layer-row${isSelected ? ' selected' : ''}`}
        style={{
          paddingLeft: 6 + depth * 14,
          borderTop: isDragOver ? '2px solid var(--color-accent)' : 'none',
          background: isDragOver ? 'rgba(251, 191, 36, 0.15)' : undefined,
        }}
        draggable="true"
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        onClick={() => actions.selectNode(node.id)}
      >
        {/* Sleek handle grip ⋮⋮ */}
        <span className="layer-row__grip">
          ⋮⋮
        </span>

        {/* Collapse toggle */}
        {def?.canHaveChildren ? (
          <button
            className="layer-toggle"
            onClick={e => { e.stopPropagation(); setCollapsed(c => !c); }}
          >
            {hasChildren ? (collapsed ? '▶' : '▼') : '·'}
          </button>
        ) : (
          <span className="layer-toggle layer-toggle--childless">·</span>
        )}
        
        <span className="layer-icon">{def?.icon ?? '?'}</span>
        <span className="layer-label truncate">{def?.label ?? node.type}</span>
        
        {/* Layer zIndex badge */}
        <span className="layer-index">
          L:{node.props?.zIndex !== undefined ? node.props.zIndex : 1}
        </span>

        <button
          className="layer-delete"
          onClick={e => { e.stopPropagation(); actions.removeNode(node.id); }}
          title="Delete"
        >✕</button>
      </div>
      {hasChildren && !collapsed && (
        <div className="layer-children">
          {sortedChildren.map(child => (
            <LayerNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LayersPanel() {
  const { activeTree } = useBuilder();
  const [open, setOpen] = useState(true);

  // Sort root-level nodes by zIndex descending
  const sortedTree = [...activeTree].sort((a, b) => (b.props?.zIndex ?? 1) - (a.props?.zIndex ?? 1));

  return (
    <div className="layers-panel" style={{
      height: open ? '320px' : '36px',
    }}>
      <button className="layers-header" onClick={() => setOpen(o => !o)}>
        <span>{open ? '▼' : '▶'}</span>
        <span className="layers-header__title">Layers</span>
        <span className="layers-count">{countNodes(activeTree)}</span>
      </button>
      {open && (
        <div className="layers-body">
          {sortedTree.length === 0 ? (
            <div className="layers-empty">No components yet</div>
          ) : (
            sortedTree.map(node => <LayerNode key={node.id} node={node} depth={0} />)
          )}
        </div>
      )}
    </div>
  );
}
