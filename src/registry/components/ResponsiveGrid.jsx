import React from 'react';

export const config = {
  type: 'ResponsiveGrid',
  label: 'Responsive Grid',
  group: 'Layout Components',
  icon: '🎛️',
  canHaveChildren: true,
  defaultProps: {
    minColWidth: 200,
    gap: 16,
    padding: 16,
    background: '#f8fafc',
  },
  schema: [
    { key: 'minColWidth', type: 'number', label: 'Min Column Width (px)' },
    { key: 'gap',         type: 'number', label: 'Gap (px)' },
    { key: 'padding',     type: 'number', label: 'Padding (px)' },
    { key: 'background',  type: 'color',  label: 'Background' },
  ],
};

export function Renderer({ props, children }) {
  const style = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(${props.minColWidth}px, 1fr))`,
    gap: props.gap,
    padding: props.padding,
    background: props.background,
    borderRadius: 4,
    minHeight: 64,
  };
  return <div className="layout-container responsive-grid" style={style}>{children}</div>;
}
