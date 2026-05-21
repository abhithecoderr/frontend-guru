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
      className="preview-container"
      style={{
        backgroundColor: settings.bgColor,
        fontFamily: settings.fontFamily === 'sans-serif' ? 'inherit' : `"${settings.fontFamily}", sans-serif`,
        paddingTop: `${settings.paddingTop}px`,
        paddingBottom: `${settings.paddingBottom}px`,
      }}
    >
      <button
        onClick={onExit}
        className="preview-exit-btn"
      >
        ◀ Back to Editor
      </button>
      <div className="preview-content">
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
