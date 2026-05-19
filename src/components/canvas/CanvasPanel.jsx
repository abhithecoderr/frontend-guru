// components/canvas/CanvasPanel.jsx
import { useState } from 'react';
import { useBuilder } from '../../store/BuilderContext.jsx';

const VIEWPORTS = [
  { id: 'desktop', label: 'Desktop', icon: '🖥' },
  { id: 'tablet',  label: 'Tablet',  icon: '▭' },
  { id: 'mobile',  label: 'Mobile',  icon: '📱' },
];

export default function CanvasPanel({ onTogglePreview, isPreview }) {
  const { state, actions } = useBuilder();
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const startRename = (page) => {
    setEditingId(page.id);
    setEditName(page.name);
  };

  const commitRename = () => {
    if (editName.trim()) actions.renamePage(editingId, editName.trim());
    setEditingId(null);
  };

  return (
    <div className="canvas-panel-strip">
      {/* ── Undo / Redo ── */}
      <button
        className={`viewport-btn${!canUndo ? ' disabled' : ''}`}
        onClick={actions.undo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
      >
        ↩ Undo
      </button>
      <button
        className={`viewport-btn${!canRedo ? ' disabled' : ''}`}
        onClick={actions.redo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
      >
        ↪ Redo
      </button>

      <div className="panel-strip__divider" />

      {/* ── Page Tabs ── */}
      <div className="page-tabs">
        {state.pages.map(page => (
          <button
            key={page.id}
            className={`page-tab${state.activePageId === page.id ? ' active' : ''}`}
            onClick={() => actions.setActivePage(page.id)}
            onDoubleClick={() => startRename(page)}
          >
            {editingId === page.id ? (
              <input
                autoFocus
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onBlur={commitRename}
                onKeyDown={e => {
                  if (e.key === 'Enter') commitRename();
                  if (e.key === 'Escape') setEditingId(null);
                }}
                style={{ background: 'transparent', border: 'none', outline: 'none', color: 'inherit', font: 'inherit', width: `${Math.max(editName.length, 3)}ch` }}
                onClick={e => e.stopPropagation()}
              />
            ) : page.name}
            {state.pages.length > 1 && (
              <span
                className="page-tab__close"
                onClick={e => { e.stopPropagation(); actions.removePage(page.id); }}
              >✕</span>
            )}
          </button>
        ))}
        <button
          className="add-page-btn"
          title="Add Page"
          onClick={() => actions.addPage(`Page ${state.pages.length + 1}`)}
        >+</button>
      </div>

      <div className="panel-strip__divider" />

      {/* ── Viewport ── */}
      <div className="viewport-controls">
        {VIEWPORTS.map(v => (
          <button
            key={v.id}
            className={`viewport-btn${state.viewport === v.id ? ' active' : ''}`}
            onClick={() => actions.setViewport(v.id)}
            title={v.label}
          >
            <span>{v.icon}</span> <span>{v.label}</span>
          </button>
        ))}
      </div>

      <div className="panel-strip__divider" />

      {/* ── Right actions ── */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, alignItems: 'center' }}>
        <button
          className={`viewport-btn${isPreview ? ' active' : ''}`}
          onClick={onTogglePreview}
          title="Toggle Preview Mode"
          style={{ color: isPreview ? 'var(--color-success)' : undefined }}
        >
          {isPreview ? '◀ Edit' : '▶ Preview'}
        </button>
        <button
          className="viewport-btn"
          onClick={() => {
            if (window.confirm('Reset all pages? This cannot be undone.')) actions.resetState();
          }}
          title="Reset canvas"
          style={{ color: 'var(--color-text-muted)' }}
        >
          🗑
        </button>
      </div>
    </div>
  );
}
