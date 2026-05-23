import React from 'react';
import LayoutSlot from '../../../components/canvas/LayoutSlot.jsx';
import './ResponsiveGrid.css';

export const config = {
  type: 'ResponsiveGrid',
  label: 'Responsive Grid',
  group: 'Layout Components',
  icon: '🎛️',
  canHaveChildren: true,
  defaultProps: {
    columnsCount: 3,
    rowsCount: 2,
    gap: 16,
    padding: 16,
    background: '#18181b',
    defaultSlotAlignX: 'none',
    defaultSlotAlignY: 'none',
    minHeight: 40,
  },
  schema: [
    { key: 'columnsCount', type: 'number', label: 'Columns' },
    { key: 'rowsCount',    type: 'number', label: 'Rows' },
    { key: 'gap',         type: 'number', label: 'Gap (px)' },
    { key: 'padding',     type: 'number', label: 'Padding (px)' },
    { key: 'background',  type: 'color',  label: 'Background' },
  ],
};

export function Renderer({ props, children, nodeId }) {
  const columnsCount = props.columnsCount || 3;
  const rowsCount = props.rowsCount || 2;
  const totalSlots = columnsCount * rowsCount;

  const style = {
    gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
    gridTemplateRows: `repeat(${rowsCount}, 1fr)`,
    gap: props.gap,
    padding: props.padding,
    background: props.background,
    borderRadius: 4,
    minHeight: props.minHeight ?? 40,
  };

  return (
    <div className="layout-container responsive-grid" style={style}>
      {Array.from({ length: totalSlots }).map((_, index) => (
        <LayoutSlot
          key={index}
          nodeId={nodeId}
          index={index}
          parentType="ResponsiveGrid"
          props={props}
        >
          {children}
        </LayoutSlot>
      ))}
    </div>
  );
}

