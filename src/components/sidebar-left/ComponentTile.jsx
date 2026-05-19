// components/sidebar-left/ComponentTile.jsx
import { useDragSource } from '../../hooks/useDragSource.js';

export default function ComponentTile({ def }) {
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
