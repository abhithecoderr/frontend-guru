// components/sidebar-left/LayersPanel.jsx
// Recursive tree view of the canvas node hierarchy

import { useState } from 'react';
import { useBuilder } from '../../store/BuilderContext.jsx';
import { getDefinition } from '../../registry/index.js';

function LayerNode({ node, depth = 0 }) {
  const { state, actions } = useBuilder();
  const def = getDefinition(node.type);
  const isSelected = state.selectedNodeId === node.id;
  const hasChildren = def?.canHaveChildren && node.children?.length > 0;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layer-node">
      <div
        className={`layer-row${isSelected ? ' selected' : ''}`}
        style={{ paddingLeft: 8 + depth * 14 }}
        onClick={() => actions.selectNode(node.id)}
      >
        {/* Collapse toggle */}
        {def?.canHaveChildren ? (
          <button
            className="layer-toggle"
            onClick={e => { e.stopPropagation(); setCollapsed(c => !c); }}
          >
            {hasChildren ? (collapsed ? '▶' : '▼') : '·'}
          </button>
        ) : (
          <span className="layer-toggle" style={{ opacity: 0.2 }}>·</span>
        )}
        <span className="layer-icon">{def?.icon ?? '?'}</span>
        <span className="layer-label truncate">{def?.label ?? node.type}</span>
        <button
          className="layer-delete"
          onClick={e => { e.stopPropagation(); actions.removeNode(node.id); }}
          title="Delete"
        >✕</button>
      </div>
      {hasChildren && !collapsed && (
        <div className="layer-children">
          {node.children.map(child => (
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

  return (
    <div className="layers-panel">
      <button className="layers-header" onClick={() => setOpen(o => !o)}>
        <span>{open ? '▼' : '▶'}</span>
        <span>Layers</span>
        <span className="layers-count">{activeTree.length}</span>
      </button>
      {open && (
        <div className="layers-body">
          {activeTree.length === 0 ? (
            <div className="layers-empty">No components yet</div>
          ) : (
            activeTree.map(node => <LayerNode key={node.id} node={node} depth={0} />)
          )}
        </div>
      )}
    </div>
  );
}
