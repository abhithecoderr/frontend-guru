// components/sidebar-right/inspectors/ToggleField.jsx
export default function ToggleField({ fieldKey, label, value, onChange }) {
  const id = `toggle-${fieldKey}`;
  return (
    <div className="field-group field-toggle-row">
      <label className="field-label" htmlFor={id}>{label}</label>
      <label className="toggle">
        <input
          id={id}
          type="checkbox"
          checked={!!value}
          onChange={e => onChange(fieldKey, e.target.checked)}
        />
        <span className="toggle__track" />
        <span className="toggle__thumb" />
      </label>
    </div>
  );
}
