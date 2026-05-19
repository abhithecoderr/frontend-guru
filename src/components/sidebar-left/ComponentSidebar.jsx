// components/sidebar-left/ComponentSidebar.jsx
import { GROUPS } from '../../registry/index.js';
import ComponentTile from './ComponentTile.jsx';
import LayersPanel from './LayersPanel.jsx';

export default function ComponentSidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <span className="sidebar__logo">Frontend<span>Guru</span></span>
      </div>

      {/* Component library — scrollable */}
      <div className="sidebar__body">
        {Object.entries(GROUPS).map(([groupName, defs]) => (
          <div key={groupName} className="component-group">
            <div className="component-group__label">{groupName}</div>
            <div className="component-grid">
              {defs.map(def => <ComponentTile key={def.type} def={def} />)}
            </div>
          </div>
        ))}
      </div>

      {/* Layers panel — pinned to bottom */}
      <LayersPanel />
    </aside>
  );
}
