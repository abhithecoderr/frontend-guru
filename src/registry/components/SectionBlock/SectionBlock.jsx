import React from 'react';
import LayoutSlot from '../../../components/canvas/LayoutSlot.jsx';
import './SectionBlock.css';

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
    background: '#09090b',
    borderStyle: 'solid',
    minHeight: 20,
    borderRadius: 8,
  },
  schema: [
    { key: 'paddingTop', type: 'number', label: 'Padding Top', unit: 'px' },
    { key: 'paddingBottom', type: 'number', label: 'Padding Bottom', unit: 'px' },
    { key: 'paddingLeft', type: 'number', label: 'Padding Left', unit: 'px' },
    { key: 'paddingRight', type: 'number', label: 'Padding Right', unit: 'px' },
    { key: 'background', type: 'color', label: 'Background' },
    { key: 'borderStyle', type: 'select', label: 'Border Style', options: ['none', 'dashed', 'solid'] },
    { key: 'borderRadius', type: 'number', label: 'Border Radius', unit: 'px' },
    { key: 'minHeight', type: 'number', label: 'Min Height', unit: 'px' },
  ],
};

export function Renderer({ props = {}, children, nodeId }) {
  const style = {
    background: props.background || '#09090b',
    border: props.borderStyle && props.borderStyle !== 'none' ? `2px ${props.borderStyle} #27272a` : '0px solid transparent',
    borderRadius: `${props.borderRadius ?? 0}px`,
    minHeight: `${props.minHeight ?? 120}px`,
  };

  return (
    <div className="layout-container section-block preview-section" style={style}>
      <LayoutSlot
        nodeId={nodeId}
        index={0}
        parentType="SectionBlock"
        props={props}
      >
        {children}
      </LayoutSlot>
    </div>
  );
}
