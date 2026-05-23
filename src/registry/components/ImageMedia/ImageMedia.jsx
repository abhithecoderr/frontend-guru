import React from 'react';
import './ImageMedia.css';

export const config = {
  type: 'ImageMedia',
  label: 'Image / Media',
  group: 'Content Primitives',
  icon: '🖼️',
  canHaveChildren: false,
  defaultProps: {
    src: '',
    alt: 'Preview image',
    height: '240px',
    borderRadius: 8,
    objectFit: 'cover',
  },
  schema: [
    { key: 'src',          type: 'text',   label: 'Image URL' },
    { key: 'alt',          type: 'text',   label: 'Alt Text' },
    { key: 'height',       type: 'text',   label: 'Height (e.g. 200px or 100%)' },
    { key: 'borderRadius', type: 'number', label: 'Border Radius (px)' },
    { key: 'objectFit',    type: 'select', label: 'Image Fit', options: ['cover', 'contain', 'fill', 'none'] },
  ],
};

export function Renderer({ props }) {
  return (
    <div className="preview-image-wrapper" style={{ height: props.height, borderRadius: `${props.borderRadius ?? 0}px` }}>
      {props.src ? (
        <img src={props.src} alt={props.alt} style={{ objectFit: props.objectFit }} />
      ) : (
        <div className="preview-image-placeholder">
          <span>🖼</span>
          <span>Drop an image URL in inspector</span>
        </div>
      )}
    </div>
  );
}
