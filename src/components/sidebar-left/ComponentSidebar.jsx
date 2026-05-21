// components/sidebar-left/ComponentSidebar.jsx
import { useState } from 'react';
import { GROUPS, GROUP_METADATA } from '../../registry/index.js';
import { useDragSource } from '../../hooks/useDragSource.js';
import LayersPanel from './LayersPanel.jsx';

function ComponentTile({ def }) {
  const dragProps = useDragSource('sidebar', def.type);
  const isWide = ['Navbar', 'HeroBanner', 'SplitFeature', 'Footer'].includes(def.type);

  return (
    <div
      className={`component-tile${isWide ? ' component-tile--wide' : ''}`}
      title={def.label}
      {...dragProps}
    >
      <span className="component-tile__icon">{def.icon}</span>
      <span className="component-tile__label">{def.label}</span>
    </div>
  );
}

export default function ComponentSidebar() {
  const availableGroups = GROUP_METADATA.filter(group => GROUPS[group.id] && GROUPS[group.id].length > 0);
  const [activeTabId, setActiveTabId] = useState(availableGroups[0]?.id || '');
  const activeComponents = GROUPS[activeTabId] || [];

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <span className="sidebar__logo">Frontend<span>Guru</span></span>
      </div>

      {/* Tabs navigation */}
      <div className="sidebar-tabs">
        {availableGroups.map(group => (
          <button
            key={group.id}
            className={`sidebar-tab-btn${activeTabId === group.id ? ' active' : ''}`}
            onClick={() => setActiveTabId(group.id)}
          >
            {group.label}
          </button>
        ))}
      </div>

      {/* Component library — scrollable */}
      <div className="sidebar__body sidebar__body--library">
        <div className="component-group">
          <div className="component-grid">
            {activeComponents.map(def => (
              <ComponentTile key={def.type} def={def} />
            ))}
          </div>
        </div>
      </div>

      {/* Layers panel — pinned to bottom */}
      <LayersPanel />
    </aside>
  );
}

