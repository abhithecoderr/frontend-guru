// App.jsx — root layout with preview mode support
import { useState } from 'react';
import { BuilderProvider, useBuilder } from './store/BuilderContext.jsx';
import { getDefinition, RENDERERS } from './registry/index.js';
import ComponentSidebar from './components/sidebar-left/ComponentSidebar.jsx';
import CanvasPanel      from './components/canvas/CanvasPanel.jsx';
import Canvas           from './components/canvas/Canvas.jsx';
import InspectorPanel   from './components/sidebar-right/InspectorPanel.jsx';

// ── Preview-mode node renderer ─────────────────────────────────────────
function PreviewNode({ node }) {
  const def = getDefinition(node.type);
  const Renderer = RENDERERS[node.type];
  if (!Renderer || !def) return null;
  const children = def.canHaveChildren
    ? (node.children || []).map(c => <PreviewNode key={c.id} node={c} />)
    : null;
  return <Renderer props={node.props}>{children}</Renderer>;
}

function PreviewCanvas({ onExit }) {
  const { activeTree, activePage } = useBuilder();
  
  const settings = activePage?.settings || {
    bgColor: '#ffffff',
    fontFamily: 'Inter',
    paddingTop: 40,
    paddingBottom: 40,
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: settings.bgColor,
        fontFamily: settings.fontFamily === 'sans-serif' ? 'inherit' : `"${settings.fontFamily}", sans-serif`,
        paddingTop: `${settings.paddingTop}px`,
        paddingBottom: `${settings.paddingBottom}px`,
        zIndex: 1000,
        overflow: 'auto',
      }}
    >
      <button
        onClick={onExit}
        style={{
          position: 'fixed', top: 12, right: 12, zIndex: 1001,
          padding: '6px 16px', background: '#6366f1', color: '#fff',
          border: 'none', borderRadius: 6, cursor: 'pointer',
          fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
          boxShadow: '0 4px 12px rgba(99,102,241,0.5)',
        }}
      >
        ◀ Back to Editor
      </button>
      <div style={{ minHeight: '100vh' }}>
        {activeTree.map(node => <PreviewNode key={node.id} node={node} />)}
      </div>
    </div>
  );
}

// ── Root shell ─────────────────────────────────────────────────────────
function Shell() {
  const [isPreview, setIsPreview] = useState(false);

  return isPreview ? (
    <PreviewCanvas onExit={() => setIsPreview(false)} />
  ) : (
    <div className="app-shell">
      <ComponentSidebar />
      <div className="canvas-column">
        <CanvasPanel
          isPreview={isPreview}
          onTogglePreview={() => setIsPreview(v => !v)}
        />
        <Canvas />
      </div>
      <InspectorPanel />
    </div>
  );
}

export default function App() {
  return (
    <BuilderProvider>
      <Shell />
    </BuilderProvider>
  );
}
