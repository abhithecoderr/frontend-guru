import React, { useState } from 'react';
import './Accordion.css';

export const config = {
  type: 'Accordion',
  label: 'Accordion Accord',
  group: 'Form Components',
  icon: '🪗',
  canHaveChildren: false,
  defaultProps: {
    items: 'How does deployment work? | Just export the production ready static bundle!\nCan I configure coordinates? | Yes, toggle the new Freeform mode in page setup!',
  },
  schema: [
    { key: 'items', type: 'textarea', label: 'FAQ items (Format: question | answer on each line)' },
  ],
};

export function Renderer({ props }) {
  const [openIdx, setOpenIdx] = useState(0);
  const items = props.items
    ? props.items.split('\n').map(row => {
        const [q, ...rest] = row.split('|');
        return { q: q?.trim(), a: rest.join('|').trim() };
      }).filter(i => i.q)
    : [];

  return (
    <div className="preview-accordion">
      {items.map((item, i) => (
        <div key={i} className="preview-accordion-item">
          <button
            className={`preview-accordion-trigger${openIdx === i ? ' open' : ''}`}
            onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
          >
            {item.q}
            <span className="preview-accordion-chevron">▼</span>
          </button>
          <div className={`preview-accordion-body${openIdx === i ? ' open' : ''}`}>
            <div className="preview-accordion-content">{item.a}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
