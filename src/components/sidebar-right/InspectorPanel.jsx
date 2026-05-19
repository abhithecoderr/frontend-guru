// components/sidebar-right/InspectorPanel.jsx
import { useBuilder } from '../../store/BuilderContext.jsx';
import { getDefinition } from '../../registry/index.js';
import TextField      from './inspectors/TextField.jsx';
import SelectField    from './inspectors/SelectField.jsx';
import ColorField     from './inspectors/ColorField.jsx';
import NumberField    from './inspectors/NumberField.jsx';
import ToggleField    from './inspectors/ToggleField.jsx';
import TextareaWidget from './inspectors/TextareaWidget.jsx';

const FIELD_MAP = {
  text:     TextField,
  textarea: TextareaWidget,
  select:   SelectField,
  color:    ColorField,
  number:   NumberField,
  toggle:   ToggleField,
};

const FONT_OPTIONS = [
  'Inter',
  'Outfit',
  'Space Grotesk',
  'Playfair Display',
  'sans-serif',
];

function findNodeById(tree, id, parentId = null) {
  for (const node of tree) {
    if (node.id === id) return { node, parentId };
    if (node.children?.length) {
      const found = findNodeById(node.children, id, node.id);
      if (found) return found;
    }
  }
  return null;
}

export default function InspectorPanel() {
  const { state, activeTree, activePage, actions } = useBuilder();
  const { selectedNodeId } = state;

  // ── Render Canvas Settings if no node is selected ──
  if (!selectedNodeId) {
    const settings = activePage?.settings || {
      bgColor: '#ffffff',
      fontFamily: 'Inter',
      paddingTop: 40,
      paddingBottom: 40,
      canvasHeight: 650,
    };

    const handleCanvasSettingChange = (key, value) => {
      actions.updateCanvasSettings({ [key]: value });
    };

    return (
      <aside className="sidebar sidebar--right inspector">
        <div className="sidebar__header">
          <span className="sidebar__logo">Inspect<span>or</span></span>
        </div>

        <div className="inspector__node-type">
          <span className="inspector__badge" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            📄 Canvas Page Settings
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            {activePage?.name || 'Settings'}
          </span>
        </div>

        <div className="inspector__fields">
          <div className="inspector__section-label">Page Setup</div>
          
          <ColorField
            fieldKey="bgColor"
            label="Background Color"
            value={settings.bgColor}
            onChange={handleCanvasSettingChange}
          />

          <SelectField
            fieldKey="fontFamily"
            label="Default Page Font"
            value={settings.fontFamily}
            options={FONT_OPTIONS}
            onChange={handleCanvasSettingChange}
          />

          <div className="inspector__section-label" style={{ marginTop: 'var(--space-4)' }}>Viewport Spacing</div>

          <NumberField
            fieldKey="paddingTop"
            label="Padding Top"
            value={settings.paddingTop}
            unit="px"
            onChange={handleCanvasSettingChange}
          />

          <NumberField
            fieldKey="paddingBottom"
            label="Padding Bottom"
            value={settings.paddingBottom}
            unit="px"
            onChange={handleCanvasSettingChange}
          />

          <NumberField
            fieldKey="canvasHeight"
            label="Canvas View Height"
            value={settings.canvasHeight}
            unit="px"
            onChange={handleCanvasSettingChange}
          />
        </div>

        <div className="inspector__empty" style={{ flex: 'none', padding: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: 11, opacity: 0.5, lineHeight: 1.4 }}>
            💡 Tip: Click empty space to see page properties. Del to delete node · Ctrl+Z undo · Ctrl+D duplicate.
          </span>
        </div>
      </aside>
    );
  }

  // ── Render standard Node inspector ──
  const found = findNodeById(activeTree, selectedNodeId);
  if (!found) return null;
  const { node, parentId } = found;

  const def = getDefinition(node.type);
  if (!def) return null;

  const handleChange = (key, value) => {
    actions.updateProps(node.id, { [key]: value });
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

      <div className="inspector__fields">
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
