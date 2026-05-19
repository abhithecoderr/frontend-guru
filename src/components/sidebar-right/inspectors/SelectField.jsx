// components/sidebar-right/inspectors/SelectField.jsx
export default function SelectField({ fieldKey, label, value, options, onChange }) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <select
        className="field-input field-select"
        value={value ?? ''}
        onChange={e => onChange(fieldKey, e.target.value)}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
