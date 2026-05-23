import React from 'react';
import LayoutSlot from '../../../components/canvas/LayoutSlot.jsx';
import './FlexRow.css';

export const config = {
  type: 'FlexRow',
  label: 'Flex Row',
  group: 'Layout Components',
  icon: '↔️',
  canHaveChildren: true,
  defaultProps: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    gap: 16,
    padding: 16,
    wrap: false,
    background: '#18181b',
    columnsCount: 3,
    columnWidths: [33.33, 33.33, 33.33],
    defaultSlotAlignX: 'none',
    defaultSlotAlignY: 'none',
    minHeight: 40,
  },
  schema: [
    { key: 'columnsCount',   type: 'number', label: 'Columns Count' },
    { key: 'alignItems',     type: 'select', label: 'Align Items',     options: ['stretch', 'center', 'flex-start', 'flex-end'] },
    { key: 'justifyContent', type: 'select', label: 'Justify Content', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] },
    { key: 'gap',            type: 'number', label: 'Gap (px)' },
    { key: 'padding',        type: 'number', label: 'Padding (px)' },
    { key: 'wrap',           type: 'toggle', label: 'Allow Wrap' },
    { key: 'background',     type: 'color',  label: 'Background' },
  ],
};

export function Renderer({ props, children, nodeId }) {
  const columnsCount = props.columnsCount || 3;

  const style = {
    alignItems: props.alignItems || 'stretch',
    justifyContent: props.justifyContent,
    gap: props.gap,
    padding: props.padding,
    flexWrap: props.wrap ? 'wrap' : 'nowrap',
    background: props.background,
    borderRadius: 4,
    minHeight: props.minHeight ?? 40,
  };

  return (
    <div className="layout-container flex-row" style={style}>
      {Array.from({ length: columnsCount }).map((_, index) => (
        <LayoutSlot
          key={index}
          nodeId={nodeId}
          index={index}
          parentType="FlexRow"
          props={props}
        >
          {children}
        </LayoutSlot>
      ))}
    </div>
  );
}

