// components/sidebar-right/inspectors/TextField.jsx
export default function TextField({ fieldKey, label, value, onChange }) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <input
        type="text"
        className="field-input"
        value={value ?? ''}
        onChange={e => onChange(fieldKey, e.target.value)}
      />
    </div>
  );
}
