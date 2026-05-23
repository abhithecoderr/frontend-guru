import React from 'react';
import './SplitFeature.css';

export const config = {
  type: 'SplitFeature',
  label: 'Split Feature',
  group: 'Layout Components',
  icon: '🔀',
  canHaveChildren: false,
  defaultProps: {
    label: 'Key Feature',
    title: 'Engineered for Performance',
    body: 'Create lightweight high performance layouts without layout shift issues.',
    features: 'Tailored state logic, Pure HSL color themes, Glassmorphic sidebars',
    imagePosition: 'left',
    mediaEmoji: '💎',
    background: '#09090b',
  },
  schema: [
    { key: 'label',         type: 'text',   label: 'Feature Eyebrow' },
    { key: 'title',         type: 'text',   label: 'Feature Title' },
    { key: 'body',          type: 'textarea', label: 'Feature Description' },
    { key: 'features',      type: 'text',   label: 'Feature Points (comma separated)' },
    { key: 'imagePosition', type: 'select', label: 'Visual Placement', options: ['left', 'right'] },
    { key: 'mediaEmoji',    type: 'text',   label: 'Feature Visual Emoji' },
    { key: 'background',    type: 'color',  label: 'Background Color' },
  ],
};

export function Renderer({ props }) {
  const features = props.features?.split(',').map(f => f.trim()).filter(Boolean) || [];
  const isRight = props.imagePosition === 'right';
  return (
    <div className={`preview-split preview-split--img-${isRight ? 'right' : 'left'}`} style={{ background: props.background }}>
      <div className="preview-split__media">{props.mediaEmoji}</div>
      <div className="preview-split__content">
        <span className="preview-split__label">{props.label}</span>
        <h2 className="preview-split__title">{props.title}</h2>
        <p className="preview-split__body">{props.body}</p>
        <div className="preview-split__features">
          {features.map(f => (
            <div key={f} className="preview-split__feature">
              <div className="preview-split__feature-icon">✓</div>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
