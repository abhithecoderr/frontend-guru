import React from 'react';

export const config = {
  type: 'HeroBanner',
  label: 'Hero Banner',
  group: 'Layout Components',
  icon: '⚡',
  canHaveChildren: false,
  defaultProps: {
    eyebrow: 'Introducing Our Product',
    title: 'Design Faster Than',
    titleAccent: 'Ever Before',
    subtitle: 'A beautiful visual builder with modular schemas and unified components working perfectly.',
    primaryCta: 'Start Free Trial',
    secondaryCta: 'Book Demo',
    bgFrom: '#000000',
    bgTo: '#18181b',
    layout: 'split',
    mediaEmoji: '🚀',
  },
  schema: [
    { key: 'eyebrow',     type: 'text',   label: 'Eyebrow Text' },
    { key: 'title',       type: 'text',   label: 'Hero Title' },
    { key: 'titleAccent', type: 'text',   label: 'Title Accent' },
    { key: 'subtitle',    type: 'textarea', label: 'Subtitle Paragraph' },
    { key: 'primaryCta',  type: 'text',   label: 'Primary CTA Label' },
    { key: 'secondaryCta',type: 'text',   label: 'Secondary CTA Label' },
    { key: 'bgFrom',      type: 'color',  label: 'Background Gradient From' },
    { key: 'bgTo',        type: 'color',  label: 'Background Gradient To' },
    { key: 'layout',      type: 'select', label: 'Layout Alignment', options: ['split', 'centered'] },
    { key: 'mediaEmoji',  type: 'text',   label: 'Visual Emoji/Character' },
  ],
};

export function Renderer({ props }) {
  const isCentered = props.layout === 'centered';
  const bgStyle = { background: `linear-gradient(135deg, ${props.bgFrom} 0%, ${props.bgTo} 100%)` };

  if (isCentered) {
    return (
      <div className="preview-hero" style={{ ...bgStyle, gridTemplateColumns: '1fr', textAlign: 'center', justifyItems: 'center' }}>
        <div className="preview-hero__content">
          <span className="preview-hero__eyebrow">{props.eyebrow}</span>
          <h1 className="preview-hero__title">{props.title} <span>{props.titleAccent}</span></h1>
          <p className="preview-hero__subtitle">{props.subtitle}</p>
          <div className="preview-hero__actions" style={{ justifyContent: 'center' }}>
            <a href="#" className="preview-btn preview-btn--primary preview-btn--lg" onClick={e=>e.preventDefault()}>{props.primaryCta}</a>
            <a href="#" className="preview-btn preview-btn--outline preview-btn--lg" onClick={e=>e.preventDefault()} style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>{props.secondaryCta}</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-hero" style={bgStyle}>
      <div className="preview-hero__content">
        <span className="preview-hero__eyebrow">{props.eyebrow}</span>
        <h1 className="preview-hero__title">{props.title} <span>{props.titleAccent}</span></h1>
        <p className="preview-hero__subtitle">{props.subtitle}</p>
        <div className="preview-hero__actions">
          <a href="#" className="preview-btn preview-btn--primary preview-btn--lg" onClick={e=>e.preventDefault()}>{props.primaryCta}</a>
          <a href="#" className="preview-btn preview-btn--outline preview-btn--lg" onClick={e=>e.preventDefault()} style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>{props.secondaryCta}</a>
        </div>
      </div>
      <div className="preview-hero__media">{props.mediaEmoji}</div>
    </div>
  );
}
