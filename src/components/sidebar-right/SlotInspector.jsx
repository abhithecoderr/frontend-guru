
import { SelectField, ColorField, NumberField } from './PropertyControls.jsx';

export default function SlotInspector({ node, state, actions, hasSelectedSlot }) {
  const handleSlotPropChange = (key, value) => {
    if (!hasSelectedSlot) return;
    const slotIndex = state.selectedSlot.slotIndex;
    const nextSlots = [...(node.props.slotsProps || [])];
    while (nextSlots.length <= slotIndex) {
      nextSlots.push({});
    }
    nextSlots[slotIndex] = {
      ...nextSlots[slotIndex],
      [key]: value,
    };
    actions.updateProps(node.id, { slotsProps: nextSlots });
  };

  if (hasSelectedSlot) {
    const slotIndex = state.selectedSlot.slotIndex;
    const slotsProps = node.props.slotsProps || [];
    const slotProps = slotsProps[slotIndex] || {};

    const slotAlignX = slotProps.alignX || node.props.defaultSlotAlignX || 'none';
    const slotAlignY = slotProps.alignY || node.props.defaultSlotAlignY || 'none';
    const isAligned = slotAlignX !== 'none' || slotAlignY !== 'none';

    return (
      <>
        <div className="inspector__section-label">⚡ Selected Slot: Drop Zone #{slotIndex + 1}</div>

        <SelectField
          fieldKey="alignX"
          label="Content Align X (Horizontal)"
          value={slotProps.alignX || 'none'}
          options={['none', 'left', 'center', 'right']}
          onChange={(key, val) => handleSlotPropChange('alignX', val)}
        />

        <SelectField
          fieldKey="alignY"
          label="Content Align Y (Vertical)"
          value={slotProps.alignY || 'none'}
          options={['none', 'top', 'center', 'bottom']}
          onChange={(key, val) => handleSlotPropChange('alignY', val)}
        />

        {isAligned && (
          <div className="inspector-slot-alert">
            🔒 <strong>Auto-Alignment Snapped:</strong> Manual dragging is locked. Nested content automatically flows within this slot. Reset alignments to <strong>none</strong> to drag freely again.
          </div>
        )}

        <div className="inspector__section-label" style={{ marginTop: 'var(--space-4)' }}>🎨 Format and Borders</div>

        <ColorField
          fieldKey="background"
          label="Background Color"
          value={slotProps.background || 'rgba(255,255,255,0.02)'}
          onChange={(key, val) => handleSlotPropChange('background', val)}
        />

        <NumberField
          fieldKey="padding"
          label="Slot Padding"
          value={slotProps.padding !== undefined ? slotProps.padding : 0}
          unit="px"
          onChange={(key, val) => handleSlotPropChange('padding', val)}
        />

        <SelectField
          fieldKey="borderStyle"
          label="Border Style"
          value={slotProps.borderStyle || 'dashed'}
          options={['none', 'dashed', 'solid', 'dotted']}
          onChange={(key, val) => handleSlotPropChange('borderStyle', val)}
        />

        <ColorField
          fieldKey="borderColor"
          label="Border Color"
          value={slotProps.borderColor || 'rgba(255,255,255,0.12)'}
          onChange={(key, val) => handleSlotPropChange('borderColor', val)}
        />

        <button
          type="button"
          className="inspector__delete-btn"
          style={{ width: '100%', marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
          onClick={() => actions.selectNode(node.id)}
        >
          ✕ Deselect Drop Zone
        </button>
      </>
    );
  }

  // No slot selected view
  const totalSlotsCount = node.type === 'FlexRow'
    ? (node.props.columnsCount || 3)
    : (node.type === 'FlexColumn' ? (node.props.rowsCount || 3) : ((node.props.columnsCount || 3) * (node.props.rowsCount || 2)));

  return (
    <div className="inspector-slot-empty">
      <div className="inspector-slot-empty-emoji">🎯</div>
      <div className="inspector-slot-empty-title">
        No Slot Selected
      </div>
      <p className="inspector-slot-empty-text">
        Click any layout slot (drop zone) on the canvas to inspect and customize its individual layout, margins, borders, and content alignment.
      </p>
      
      <div className="inspector-slot-empty-select-container">
        <SelectField
          fieldKey="select-slot-direct"
          label="Quick Select Drop Zone"
          value=""
          options={['Select...', ...Array.from({ length: totalSlotsCount }).map((_, idx) => `Slot #${idx + 1}`)]}
          onChange={(key, val) => {
            if (val && val !== 'Select...') {
              const idx = parseInt(val.replace('Slot #', ''), 10) - 1;
              actions.selectSlot(node.id, idx);
            }
          }}
        />
      </div>
    </div>
  );
}
