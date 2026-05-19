import React from 'react';

export const config = {
  type: 'SectionBlock',
  label: 'Section Block',
  group: 'Layout Components',
  icon: '⏹',
  canHaveChildren: true,
  defaultProps: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 24,
    paddingRight: 24,
    background: '#ffffff',
    borderStyle: 'none',
  },
  schema: [
    { key: 'paddingTop',    type: 'number', label: 'Padding Top',    unit: 'px' },
    { key: 'paddingBottom', type: 'number', label: 'Padding Bottom', unit: 'px' },
    { key: 'paddingLeft',   type: 'number', label: 'Padding Left',   unit: 'px' },
    { key: 'paddingRight',  type: 'number', label: 'Padding Right',  unit: 'px' },
    { key: 'background',    type: 'color',  label: 'Background' },
    { key: 'borderStyle',   type: 'select', label: 'Border Style',   options: ['none', 'dashed', 'solid'] },
  ],
};

export function Renderer({ props, children }) {
  const style = {
    width: '100%',
    padding: `${props.paddingTop}px ${props.paddingRight}px ${props.paddingBottom}px ${props.paddingLeft}px`,
    background: props.background,
    border: props.borderStyle !== 'none' ? `2px ${props.borderStyle} #e2e8f0` : 'none',
    borderRadius: 4,
    minHeight: 80,
  };
  return <section className="layout-container section-block preview-section" style={style}>{children}</section>;
}
