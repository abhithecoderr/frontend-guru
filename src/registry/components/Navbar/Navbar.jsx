import React from 'react';
import './Navbar.css';

export const config = {
  type: 'Navbar',
  label: 'Navigation Bar',
  group: 'Layout Components',
  icon: '🗺️',
  canHaveChildren: false,
  defaultProps: {
    logoText: 'Brand',
    logoAccent: 'Guru',
    links: 'Home, Features, Pricing, About',
    ctaLabel: 'Get Started',
    ctaVariant: 'primary',
    background: '#09090b',
    sticky: false,
  },
  schema: [
    { key: 'logoText',   type: 'text',   label: 'Logo Text' },
    { key: 'logoAccent', type: 'text',   label: 'Logo Accent' },
    { key: 'links',      type: 'text',   label: 'Nav Links (comma separated)' },
    { key: 'ctaLabel',   type: 'text',   label: 'CTA Label' },
    { key: 'ctaVariant', type: 'select', label: 'CTA Variant', options: ['primary', 'secondary', 'outline'] },
    { key: 'background', type: 'color',  label: 'Background' },
    { key: 'sticky',     type: 'toggle', label: 'Sticky Header' },
  ],
};

export function Renderer({ props }) {
  const links = props.links?.split(',').map(l => l.trim()).filter(Boolean) || [];
  return (
    <nav className="preview-navbar" style={{ background: props.background, position: props.sticky ? 'sticky' : 'relative', top: 0, zIndex: 100 }}>
      <div className="preview-navbar__logo">
        {props.logoText}<span>{props.logoAccent}</span>
      </div>
      <ul className="preview-navbar__links">
        {links.map(l => <li key={l}><a href="#" onClick={e => e.preventDefault()}>{l}</a></li>)}
      </ul>
      <div className="preview-navbar__cta">
        <a href="#" className={`preview-btn preview-btn--${props.ctaVariant} preview-btn--sm`} onClick={e => e.preventDefault()}>
          {props.ctaLabel}
        </a>
      </div>
    </nav>
  );
}
