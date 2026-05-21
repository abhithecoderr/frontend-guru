import React from 'react';

export const config = {
  type: 'Footer',
  label: 'Page Footer',
  group: 'Layout Components',
  icon: '🔻',
  canHaveChildren: false,
  defaultProps: {
    logoText: 'Frontend',
    logoAccent: 'Guru',
    tagline: 'Modern dynamic web designer platform.',
    col1Title: 'Products',
    col1Links: 'Builder, Templates, Pricing, Enterprise',
    col2Title: 'Resources',
    col2Links: 'Documentation, Tutorials, Blog, Support',
    col3Title: 'Company',
    col3Links: 'About Us, Careers, Contact, Press',
    copyright: '© 2026 Frontend Guru Inc. All Rights Reserved.',
    background: '#09090b',
  },
  schema: [
    { key: 'logoText',   type: 'text',   label: 'Logo Text' },
    { key: 'logoAccent', type: 'text',   label: 'Logo Accent' },
    { key: 'tagline',    type: 'text',   label: 'Tagline Paragraph' },
    { key: 'col1Title',  type: 'text',   label: 'Column 1 Title' },
    { key: 'col1Links',  type: 'text',   label: 'Col 1 Links (comma separated)' },
    { key: 'col2Title',  type: 'text',   label: 'Column 2 Title' },
    { key: 'col2Links',  type: 'text',   label: 'Col 2 Links (comma separated)' },
    { key: 'col3Title',  type: 'text',   label: 'Column 3 Title' },
    { key: 'col3Links',  type: 'text',   label: 'Col 3 Links (comma separated)' },
    { key: 'copyright',  type: 'text',   label: 'Copyright Line' },
    { key: 'background', type: 'color',  label: 'Background' },
  ],
};

export function Renderer({ props }) {
  const col1 = props.col1Links?.split(',').map(l=>l.trim()).filter(Boolean)||[];
  const col2 = props.col2Links?.split(',').map(l=>l.trim()).filter(Boolean)||[];
  const col3 = props.col3Links?.split(',').map(l=>l.trim()).filter(Boolean)||[];
  return (
    <footer className="preview-footer" style={{ background: props.background }}>
      <div className="preview-footer__grid">
        <div className="preview-footer__brand">
          <div className="preview-footer__logo">{props.logoText}<span>{props.logoAccent}</span></div>
          <p className="preview-footer__tagline">{props.tagline}</p>
        </div>
        {[{ title: props.col1Title, links: col1 }, { title: props.col2Title, links: col2 }, { title: props.col3Title, links: col3 }].map(col => (
          <div key={col.title}>
            <div className="preview-footer__col-title">{col.title}</div>
            <ul className="preview-footer__links">
              {col.links.map(l => <li key={l}><a href="#" onClick={e=>e.preventDefault()}>{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="preview-footer__bottom">
        <span>{props.copyright}</span>
        <span style={{ color: '#f59e0b', fontWeight: 600 }}>Built with Frontend Guru ⚡</span>
      </div>
    </footer>
  );
}
