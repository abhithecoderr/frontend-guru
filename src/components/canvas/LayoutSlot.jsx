// components/canvas/LayoutSlot.jsx
import React from 'react';
import { useBuilder } from '../../store/BuilderContext.jsx';

export default function LayoutSlot({
  nodeId,
  index = 0,
  parentType,
  props = {},
  children,
}) {
  const { state, actions } = useBuilder();
  const isSelectedSlot = state.selectedSlot?.nodeId === nodeId && state.selectedSlot?.slotIndex === index;
  
  // 1. Centralized Child Filtering: Filter parent's children by slotIndex
  const childrenArray = React.Children.toArray(children);
  const slotChildren = childrenArray.filter(child => {
    if (parentType === 'SectionBlock') return true;
    const childSlotIndex = child.props.node?.props?.slotIndex ?? 0;
    return childSlotIndex === index;
  });

  // 2. Load Slot-specific User Customized Properties
  const slotsProps = props.slotsProps || [];
  const slotProps = slotsProps[index] || {};
  
  // 3. Centralized Styling Variables
  const isParentActive = state.selectedNodeId === nodeId || state.selectedSlot?.nodeId === nodeId;

  // Background: use custom if set, else tint if parent is active/selected, else transparent
  const slotBg = slotProps.background 
    ? slotProps.background 
    : (isParentActive ? 'rgba(255, 255, 255, 0.02)' : 'transparent');

  const slotPadding = slotProps.padding !== undefined ? `${slotProps.padding}px` : '0px';

  // Border Style: use custom if set, else dashed if parent is active/selected, else none
  const slotBorderStyle = slotProps.borderStyle 
    ? slotProps.borderStyle 
    : (isParentActive ? 'dashed' : 'none');

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

  // 4. Smart Sizing & Layout Calculations based on the Parent Type
  let parentSpecificStyle = {};
  let slotClassName = '';

  if (parentType === 'FlexRow') {
    slotClassName = 'flex-row-slot';
    const columnsCount = props.columnsCount || 3;
    const columnWidths = props.columnWidths || Array(columnsCount).fill(100 / columnsCount);
    const slotWidth = columnWidths[index] !== undefined ? columnWidths[index] : (100 / columnsCount);
    const gapOffset = props.gap ? `${(props.gap * (columnsCount - 1)) / columnsCount}px` : '0px';
    const flexWidthStyle = `calc(${slotWidth}% - ${gapOffset})`;
    
    parentSpecificStyle = {
      flex: `0 0 ${flexWidthStyle}`,
      width: flexWidthStyle,
      height: '100%', // Stretch to parent vertical height
    };
  } else if (parentType === 'FlexColumn') {
    slotClassName = 'flex-col-slot';
    const rowsCount = props.rowsCount || 3;
    const rowHeights = props.rowHeights || Array(rowsCount).fill(100 / rowsCount);
    const slotHeight = rowHeights[index] !== undefined ? rowHeights[index] : (100 / rowsCount);
    const gapOffset = props.gap ? `${(props.gap * (rowsCount - 1)) / rowsCount}px` : '0px';
    const flexHeightStyle = `calc(${slotHeight}% - ${gapOffset})`;

    parentSpecificStyle = {
      flex: `0 0 ${flexHeightStyle}`,
      height: flexHeightStyle,
    };
  } else if (parentType === 'ResponsiveGrid') {
    slotClassName = 'grid-slot';
    // Sizing is natively driven by grid rules on the container
  } else if (parentType === 'SectionBlock') {
    slotClassName = 'section-slot';
    parentSpecificStyle = {
      width: '100%',
      height: '100%',
      flex: '1 1 auto',
      padding: `${props.paddingTop ?? 40}px ${props.paddingRight ?? 24}px ${props.paddingBottom ?? 40}px ${props.paddingLeft ?? 24}px`,
      backgroundColor: 'transparent',
    };
  }

  // 5. SectionBlock does not select slots on click or draw active outlines
  const isSectionBlock = parentType === 'SectionBlock';
  
  const parentHasFixedHeight = props.height && props.height > 0;
  const baseMinHeight = isSectionBlock 
    ? undefined 
    : (parentHasFixedHeight ? '0px' : '64px');

  return (
    <div
      className={`layout-slot ${slotClassName}`}
      data-slot-index={index}
      onClick={(e) => {
        e.stopPropagation();
        if (isSectionBlock) {
          actions.selectNode(nodeId); // Focus directly on the parent Section container
        } else {
          actions.selectSlot(nodeId, index);
        }
      }}
      style={{
        position: 'relative',
        minHeight: baseMinHeight,
        boxSizing: 'border-box',
        border: isSectionBlock ? 'none' : slotBorder,
        borderRadius: isSectionBlock ? undefined : 4,
        backgroundColor: isSectionBlock ? 'transparent' : slotBg,
        padding: isSectionBlock ? undefined : slotPadding,
        outline: !isSectionBlock && isSelectedSlot ? '2px solid var(--color-accent)' : 'none',
        outlineOffset: '-2px',
        boxShadow: !isSectionBlock && isSelectedSlot ? '0 0 8px rgba(255, 158, 11, 0.3)' : 'none',
        transition: 'all 0.2s ease',
        ...alignStyle,
        ...parentSpecificStyle,
      }}
    >
      {slotChildren}
    </div>
  );
}
