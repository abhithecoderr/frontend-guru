// components/sidebar-right/inspectors/ColorField.jsx
export default function ColorField({ fieldKey, label, value, onChange }) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <div className="field-color-row">
        <input
          type="color"
          className="field-color-swatch"
          value={value ?? '#ffffff'}
          onChange={e => onChange(fieldKey, e.target.value)}
        />
        <input
          type="text"
          className="field-input"
          value={value ?? ''}
          onChange={e => onChange(fieldKey, e.target.value)}
          placeholder="#rrggbb"
        />
      </div>
    </div>
  );
}
