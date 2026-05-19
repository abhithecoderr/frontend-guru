// components/sidebar-right/inspectors/NumberField.jsx
export default function NumberField({ fieldKey, label, value, unit, onChange }) {
  return (
    <div className="field-group">
      <label className="field-label">{label}{unit ? ` (${unit})` : ''}</label>
      <input
        type="number"
        className="field-input"
        value={value ?? 0}
        onChange={e => onChange(fieldKey, Number(e.target.value))}
        style={{ width: '100%' }}
      />
    </div>
  );
}
