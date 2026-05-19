// components/sidebar-right/inspectors/TextareaWidget.jsx
// Used for long-form text fields (accordion items, hero body, etc.)
export default function TextareaWidget({ fieldKey, label, value, onChange }) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <textarea
        className="field-input field-textarea"
        value={value ?? ''}
        onChange={e => onChange(fieldKey, e.target.value)}
        rows={4}
        spellCheck={false}
      />
    </div>
  );
}
