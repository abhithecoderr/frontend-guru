import React from 'react';

export const config = {
  type: 'FlexRow',
  label: 'Flex Row',
  group: 'Layout Components',
  icon: '↔️',
  canHaveChildren: true,
  defaultProps: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 16,
    padding: 16,
    wrap: true,
    background: '#f1f5f9',
  },
  schema: [
    { key: 'alignItems',     type: 'select', label: 'Align Items',     options: ['stretch', 'center', 'flex-start', 'flex-end'] },
    { key: 'justifyContent', type: 'select', label: 'Justify Content', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] },
    { key: 'gap',            type: 'number', label: 'Gap (px)' },
    { key: 'padding',        type: 'number', label: 'Padding (px)' },
    { key: 'wrap',           type: 'toggle', label: 'Allow Wrap' },
    { key: 'background',     type: 'color',  label: 'Background' },
  ],
};

export function Renderer({ props, children }) {
  const style = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: props.alignItems,
    justifyContent: props.justifyContent,
    gap: props.gap,
    padding: props.padding,
    flexWrap: props.wrap ? 'wrap' : 'nowrap',
    background: props.background,
    borderRadius: 4,
    minHeight: 48,
  };
  return <div className="layout-container flex-row" style={style}>{children}</div>;
}
