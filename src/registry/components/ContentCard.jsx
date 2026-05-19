import React from 'react';

export const config = {
  type: 'ContentCard',
  label: 'Content Card',
  group: 'Layout Components',
  icon: '🎴',
  canHaveChildren: false,
  defaultProps: {
    tag: 'Feature',
    title: 'Interactive Blocks',
    text: 'Build completely dynamic custom applications using responsive visual interfaces built live.',
    ctaLabel: 'Learn More',
    mediaEmoji: '🚀',
    mediaBackground: '#e0e7ff',
  },
  schema: [
    { key: 'tag',             type: 'text',   label: 'Card Tag/Badge' },
    { key: 'title',           type: 'text',   label: 'Card Title' },
    { key: 'text',            type: 'textarea', label: 'Card Body Paragraph' },
    { key: 'ctaLabel',        type: 'text',   label: 'CTA Link Text' },
    { key: 'mediaEmoji',      type: 'text',   label: 'Media Emoji Icon' },
    { key: 'mediaBackground', type: 'color',  label: 'Media Circle Background' },
  ],
};

export function Renderer({ props }) {
  return (
    <div className="preview-card">
      <div className="preview-card__img" style={{ background: props.mediaBackground }}>{props.mediaEmoji}</div>
      <div className="preview-card__body">
        <span className="preview-card__tag">{props.tag}</span>
        <h3 className="preview-card__title">{props.title}</h3>
        <p className="preview-card__text">{props.text}</p>
        <a href="#" className="preview-btn preview-btn--outline preview-btn--sm" onClick={e=>e.preventDefault()}>{props.ctaLabel}</a>
      </div>
    </div>
  );
}
