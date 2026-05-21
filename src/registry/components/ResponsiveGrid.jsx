import React from 'react';
import { useBuilder } from '../../store/BuilderContext.jsx';

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
  const { state, actions } = useBuilder();
  const columnsCount = props.columnsCount || 3;
  const rowsCount = props.rowsCount || 2;
  const totalSlots = columnsCount * rowsCount;

  const style = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
    gridTemplateRows: `repeat(${rowsCount}, 1fr)`,
    gap: props.gap,
    padding: props.padding,
    background: props.background,
    borderRadius: 4,
    minHeight: 128,
    boxSizing: 'border-box',
    width: '100%',
  };

  const childrenArray = React.Children.toArray(children);
  const slotsProps = props.slotsProps || [];

  return (
    <div className="layout-container responsive-grid" style={style}>
      {Array.from({ length: totalSlots }).map((_, index) => {
        const slotChildren = childrenArray.filter(child => {
          const childSlotIndex = child.props.node?.props?.slotIndex ?? 0;
          return childSlotIndex === index;
        });

        const isSelectedSlot = state.selectedSlot?.nodeId === nodeId && state.selectedSlot?.slotIndex === index;
        const slotProps = slotsProps[index] || {};

        const slotBg = slotProps.background || 'rgba(255, 255, 255, 0.02)';
        const slotPadding = slotProps.padding !== undefined ? `${slotProps.padding}px` : '0px';
        const slotBorderStyle = slotProps.borderStyle || 'dashed';
        const slotBorderColor = slotProps.borderColor || 'rgba(255, 255, 255, 0.12)';
        const slotBorder = slotBorderStyle === 'none' ? 'none' : `1px ${slotBorderStyle} ${slotBorderColor}`;

        const slotAlignX = slotProps.alignX || props.defaultSlotAlignX || 'none';
        const slotAlignY = slotProps.alignY || props.defaultSlotAlignY || 'none';
        const isAligned = slotAlignX !== 'none' || slotAlignY !== 'none';

        const alignStyle = isAligned ? {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: slotAlignY === 'center' ? 'center' : (slotAlignY === 'bottom' ? 'flex-end' : 'flex-start'),
          alignItems: slotAlignX === 'center' ? 'center' : (slotAlignX === 'right' ? 'flex-end' : 'flex-start'),
        } : {};

        return (
          <div
            key={index}
            className="layout-slot grid-slot"
            data-slot-index={index}
            onClick={(e) => {
              e.stopPropagation();
              actions.selectSlot(nodeId, index);
            }}
            style={{
              position: 'relative',
              minHeight: 64,
              boxSizing: 'border-box',
              border: slotBorder,
              borderRadius: 4,
              backgroundColor: slotBg,
              padding: slotPadding,
              outline: isSelectedSlot ? '2px solid var(--color-accent)' : 'none',
              outlineOffset: '-2px',
              boxShadow: isSelectedSlot ? '0 0 8px rgba(255, 158, 11, 0.3)' : 'none',
              transition: 'all 0.2s ease',
              ...alignStyle
            }}
          >
            {slotChildren}
          </div>
        );
      })}
    </div>
  );
}

