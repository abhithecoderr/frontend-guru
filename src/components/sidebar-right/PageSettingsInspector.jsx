import { ColorField, SelectField, NumberField } from './PropertyControls.jsx';

const FONT_OPTIONS = [
  'Inter',
  'Outfit',
  'Space Grotesk',
  'Playfair Display',
  'sans-serif',
];

export default function PageSettingsInspector({ activePage, actions }) {
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
    <>
      <div className="inspector__node-type">
        <span className="inspector__badge">
          📄 Canvas Page Settings
        </span>
        <span className="page-settings-name" style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
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
    </>
  );
}
