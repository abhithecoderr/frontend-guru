// components/sidebar-right/inspectors/PropertyControls.jsx

/**
 * Standard Text input property control.
 */
export function TextField({ fieldKey, label, value, onChange }) {
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

/**
 * Number input property control with optional unit label.
 */
export function NumberField({ fieldKey, label, value, unit, onChange }) {
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

/**
 * Select drop-down property control.
 */
export function SelectField({ fieldKey, label, value, options, onChange }) {
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

/**
 * Color picker and text hex-input control.
 */
export function ColorField({ fieldKey, label, value, onChange }) {
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

/**
 * Toggle checkbox switch control.
 */
export function ToggleField({ fieldKey, label, value, onChange }) {
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

/**
 * Long-form text textarea control.
 */
export function TextareaWidget({ fieldKey, label, value, onChange }) {
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
