import React from 'react';

export const config = {
  type: 'Button',
  label: 'Button',
  group: 'Content Primitives',
  icon: '⬜',
  canHaveChildren: false,
  defaultProps: {
    label: 'Click me',
    variant: 'primary',
    size: 'md',
    href: '#',
    fullWidth: false,
  },
  schema: [
    { key: 'label',     type: 'text',   label: 'Label' },
    { key: 'variant',   type: 'select', label: 'Variant',    options: ['primary','secondary','outline','ghost'] },
    { key: 'size',      type: 'select', label: 'Size',       options: ['sm','md','lg'] },
    { key: 'href',      type: 'text',   label: 'Link URL' },
    { key: 'fullWidth', type: 'toggle', label: 'Full Width' },
  ],
};

export function Renderer({ props }) {
  const style = props.fullWidth ? { width: '100%' } : {};
  return (
    <a
      href={props.href || '#'}
      className={`preview-btn preview-btn--${props.variant} preview-btn--${props.size}`}
      style={style}
      onClick={e => e.preventDefault()}
    >
      {props.label}
    </a>
  );
}
