import React from 'react';
import LayoutSlot from '../../../components/canvas/LayoutSlot.jsx';
import './FlexColumn.css';

export const config = {
  type: 'FlexColumn',
  label: 'Flex Column',
  group: 'Layout Components',
  icon: '↕️',
  canHaveChildren: true,
  defaultProps: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    gap: 16,
    padding: 16,
    background: '#18181b',
    rowsCount: 3,
    rowHeights: [33.33, 33.33, 33.33],
    defaultSlotAlignX: 'none',
    defaultSlotAlignY: 'none',
    minHeight: 40,
  },
  schema: [
    { key: 'rowsCount',      type: 'number', label: 'Rows Count' },
    { key: 'alignItems',     type: 'select', label: 'Align Items',     options: ['stretch', 'center', 'flex-start', 'flex-end'] },
    { key: 'justifyContent', type: 'select', label: 'Justify Content', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] },
    { key: 'gap',            type: 'number', label: 'Gap (px)' },
    { key: 'padding',        type: 'number', label: 'Padding (px)' },
    { key: 'background',     type: 'color',  label: 'Background' },
  ],
};

export function Renderer({ props, children, nodeId }) {
  const rowsCount = props.rowsCount || 3;

  const style = {
    alignItems: props.alignItems || 'stretch',
    justifyContent: props.justifyContent,
    gap: props.gap,
    padding: props.padding,
    background: props.background,
    borderRadius: 4,
    minHeight: props.minHeight ?? 40,
  };

  return (
    <div className="layout-container flex-col" style={style}>
      {Array.from({ length: rowsCount }).map((_, index) => (
        <LayoutSlot
          key={index}
          nodeId={nodeId}
          index={index}
          parentType="FlexColumn"
          props={props}
        >
          {children}
        </LayoutSlot>
      ))}
    </div>
  );
}

