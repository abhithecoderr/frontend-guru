// components/sidebar-right/InspectorPanel.jsx
import React, { useState, useEffect } from 'react';
import { useBuilder } from '../../store/BuilderContext.jsx';
import { getDefinition } from '../../registry/index.js';
import {
  TextField,
  SelectField,
  ColorField,
  NumberField,
  ToggleField,
  TextareaWidget
} from './PropertyControls.jsx';
import { findNodeById, countNodes } from '../../utils/treeUtils.js';

import PageSettingsInspector from './PageSettingsInspector.jsx';
import LayoutRebalancer from './LayoutRebalancer.jsx';
import SlotInspector from './SlotInspector.jsx';

const FIELD_MAP = {
  text:     TextField,
  textarea: TextareaWidget,
  select:   SelectField,
  color:    ColorField,
  number:   NumberField,
  toggle:   ToggleField,
};

function LayeringControls({ node, activeTree, onChange }) {
  const maxZ = Math.max(1, countNodes(activeTree));
  const currentZ = node.props.zIndex !== undefined ? node.props.zIndex : 1;

  return (
    <>
      <NumberField
        fieldKey="zIndex"
        label={`Z-Index (Layer, max L:${maxZ})`}
        value={currentZ}
        unit=""
        onChange={(key, val) => {
          const clampedVal = Math.max(1, Math.min(maxZ, parseInt(val) || 1));
          onChange(key, clampedVal);
        }}
      />

      <div className="inspector-layer-buttons">
        <button
          type="button"
          className="inspector__delete-btn inspector-layer-btn"
          onClick={() => onChange('zIndex', Math.min(maxZ, currentZ + 1))}
        >
          ▲ Bring Up
        </button>
        <button
          type="button"
          className="inspector__delete-btn inspector-layer-btn"
          onClick={() => onChange('zIndex', Math.max(1, currentZ - 1))}
        >
          ▼ Move Down
        </button>
      </div>
    </>
  );
}

function SlotPositioner({ node, parentId, activeTree, onChange }) {
  if (!parentId) return null;
  const parentFound = findNodeById(activeTree, parentId);
  if (!parentFound) return null;

  const parentNode = parentFound.node;
  let slotOptions = [];
  if (parentNode.type === 'FlexRow') {
    const count = parentNode.props.columnsCount || 3;
    slotOptions = Array.from({ length: count }).map((_, i) => ({ value: i, label: `Column ${i + 1}` }));
  } else if (parentNode.type === 'FlexColumn') {
    const count = parentNode.props.rowsCount || 3;
    slotOptions = Array.from({ length: count }).map((_, i) => ({ value: i, label: `Row ${i + 1}` }));
  } else if (parentNode.type === 'ResponsiveGrid') {
    const cols = parentNode.props.columnsCount || 3;
    const rows = parentNode.props.rowsCount || 2;
    slotOptions = Array.from({ length: cols * rows }).map((_, i) => ({ value: i, label: `Grid Cell ${i + 1}` }));
  }

  if (slotOptions.length === 0) return null;

  return (
    <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', paddingBottom: 'var(--space-2)' }}>
      <div className="inspector__section-label">Slot Positioning</div>
      <SelectField
        fieldKey="slotIndex"
        label="Move to Layout Slot"
        value={slotOptions[node.props.slotIndex]?.label || slotOptions[0].label}
        options={slotOptions.map(opt => opt.label)}
        onChange={(key, val) => {
          const idx = slotOptions.findIndex(opt => opt.label === val);
          onChange('slotIndex', idx !== -1 ? idx : 0);
        }}
      />
    </div>
  );
}

export default function InspectorPanel() {
  const { state, activeTree, activePage, actions } = useBuilder();
  const { selectedNodeId } = state;

  const found = selectedNodeId ? findNodeById(activeTree, selectedNodeId) : null;
  const node = found?.node;
  const parentId = found?.parentId;
  const def = node ? getDefinition(node.type) : null;
  const isLayout = def ? def.group === 'Layout Components' : false;
  const hasSelectedSlot = !!(node && state.selectedSlot && state.selectedSlot.nodeId === node.id);

  const [activeTab, setActiveTab] = useState('container');

  // Reactively sync inspector tab with slot selection state
  useEffect(() => {
    if (hasSelectedSlot) {
      setActiveTab('slot');
    } else {
      setActiveTab('container');
    }
  }, [hasSelectedSlot, state.selectedSlot?.slotIndex]);

  // ── Render Canvas Settings if no node is selected ──
  if (!selectedNodeId) {
    return (
      <aside className="sidebar sidebar--right inspector">
        <div className="sidebar__header">
          <span className="sidebar__logo">Inspect<span>or</span></span>
        </div>
        <PageSettingsInspector activePage={activePage} actions={actions} />
      </aside>
    );
  }

  // ── Render standard Node inspector ──
  if (!found || !node || !def) return null;

  const handleChange = (key, value) => {
    if (node.type === 'FlexRow' && key === 'columnsCount') {
      const count = Math.max(1, parseInt(value) || 1);
      const widths = Array(count).fill(Math.round(10000 / count) / 100);
      actions.updateProps(node.id, { columnsCount: count, columnWidths: widths });
    } else if (node.type === 'FlexColumn' && key === 'rowsCount') {
      const count = Math.max(1, parseInt(value) || 1);
      const heights = Array(count).fill(Math.round(10000 / count) / 100);
      actions.updateProps(node.id, { rowsCount: count, rowHeights: heights });
    } else {
      actions.updateProps(node.id, { [key]: value });
    }
  };

  return (
    <aside className="sidebar sidebar--right inspector">
      <div className="sidebar__header">
        <span className="sidebar__logo">Inspect<span>or</span></span>
      </div>

      <div className="inspector__node-type">
        <span className="inspector__badge">{def.icon} {def.label}</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
          #{node.id}
        </span>
      </div>

      {/* Tab Switchers for Layout Components */}
      {isLayout && (
        <div className="inspector-tabs">
          <button
            type="button"
            className={`inspector-tab-btn ${activeTab === 'container' ? 'inspector-tab-btn--active-container' : ''}`}
            onClick={() => setActiveTab('container')}
          >
            📦 Parent Container
          </button>
          <button
            type="button"
            className={`inspector-tab-btn ${activeTab === 'slot' ? 'inspector-tab-btn--active-slot' : ''}`}
            onClick={() => setActiveTab('slot')}
          >
            ⚡ Drop Zone Slot
          </button>
        </div>
      )}

      <div className="inspector__fields">
        {activeTab === 'container' ? (
          <>
            <div className="inspector__section-label">Properties</div>
            {def.schema.map(field => {
              const Widget = FIELD_MAP[field.type] || TextField;
              return (
                <Widget
                  key={field.key}
                  fieldKey={field.key}
                  label={field.label}
                  value={node.props[field.key]}
                  options={field.options}
                  unit={field.unit}
                  onChange={handleChange}
                />
              );
            })}

            {/* Parent Default Drop Zone Alignments (Layout Only) */}
            {isLayout && (
              <>
                <div className="inspector__section-label" style={{ marginTop: 'var(--space-4)' }}>🔧 Default Slot Alignments</div>
                <SelectField
                  fieldKey="defaultSlotAlignX"
                  label="Default Content Align X"
                  value={node.props.defaultSlotAlignX || 'none'}
                  options={['none', 'left', 'center', 'right']}
                  onChange={handleChange}
                />
                <SelectField
                  fieldKey="defaultSlotAlignY"
                  label="Default Content Align Y"
                  value={node.props.defaultSlotAlignY || 'none'}
                  options={['none', 'top', 'center', 'bottom']}
                  onChange={handleChange}
                />
              </>
            )}

            <div className="inspector__section-label" style={{ marginTop: 'var(--space-4)' }}>Layout & Spacing</div>
            
            <NumberField
              fieldKey="width"
              label="Width (0 = Auto)"
              value={node.props.width !== undefined ? node.props.width : 0}
              unit="px"
              onChange={handleChange}
            />

            <NumberField
              fieldKey="height"
              label="Height (0 = Auto)"
              value={node.props.height !== undefined ? node.props.height : 0}
              unit="px"
              onChange={handleChange}
            />

            <SelectField
              fieldKey="alignSelf"
              label="Alignment (Horizontal)"
              value={node.props.alignSelf || 'auto'}
              options={['auto', 'flex-start', 'center', 'flex-end', 'stretch']}
              onChange={handleChange}
            />

            <NumberField
              fieldKey="marginTop"
              label="Margin Top"
              value={node.props.marginTop !== undefined ? node.props.marginTop : 0}
              unit="px"
              onChange={handleChange}
            />

            <NumberField
              fieldKey="marginBottom"
              label="Margin Bottom"
              value={node.props.marginBottom !== undefined ? node.props.marginBottom : 0}
              unit="px"
              onChange={handleChange}
            />

            <LayeringControls
              node={node}
              activeTree={activeTree}
              onChange={handleChange}
            />

            {/* Layout Columns/Rows rebalancer sliders */}
            <LayoutRebalancer node={node} actions={actions} />

            {/* Nesting Child Slot Swapper */}
            <SlotPositioner
              node={node}
              parentId={parentId}
              activeTree={activeTree}
              onChange={handleChange}
            />
          </>
        ) : (
          /* Active Tab is 'slot' */
          <SlotInspector
            node={node}
            state={state}
            actions={actions}
            hasSelectedSlot={hasSelectedSlot}
          />
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, padding: '0 var(--space-4) var(--space-3)' }}>
        <button
          className="inspector__delete-btn"
          style={{ flex: 1, margin: 0 }}
          onClick={() => actions.duplicateNode(node.id)}
        >
          ⧉ Duplicate
        </button>
        <button
          className="inspector__delete-btn"
          style={{ flex: 1, margin: 0 }}
          onClick={() => actions.removeNode(node.id)}
        >
          🗑 Delete
        </button>
      </div>
    </aside>
  );
}
