import React from 'react';
import { useBuilder } from '../../store/BuilderContext.jsx';

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
  const { state, actions } = useBuilder();
  const rowsCount = props.rowsCount || 3;
  const rowHeights = props.rowHeights || Array(rowsCount).fill(100 / rowsCount);

  const style = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: props.alignItems || 'stretch',
    justifyContent: props.justifyContent,
    gap: props.gap,
    padding: props.padding,
    background: props.background,
    borderRadius: 4,
    minHeight: 120,
    boxSizing: 'border-box',
    width: '100%',
  };

  const childrenArray = React.Children.toArray(children);
  const slotsProps = props.slotsProps || [];

  return (
    <div className="layout-container flex-col" style={style}>
      {Array.from({ length: rowsCount }).map((_, index) => {
        const slotHeight = rowHeights[index] !== undefined ? rowHeights[index] : (100 / rowsCount);
        const slotChildren = childrenArray.filter(child => {
          const childSlotIndex = child.props.node?.props?.slotIndex ?? 0;
          return childSlotIndex === index;
        });

        const gapOffset = props.gap ? `${(props.gap * (rowsCount - 1)) / rowsCount}px` : '0px';
        const flexHeightStyle = `calc(${slotHeight}% - ${gapOffset})`;

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
            className="layout-slot flex-col-slot"
            data-slot-index={index}
            onClick={(e) => {
              e.stopPropagation();
              actions.selectSlot(nodeId, index);
            }}
            style={{
              flex: `0 0 ${flexHeightStyle}`,
              height: flexHeightStyle,
              width: '100%',
              position: 'relative',
              minHeight: 48,
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

