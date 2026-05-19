import React from 'react';

export const config = {
  type: 'TextareaBox',
  label: 'Textarea Box',
  group: 'Form Components',
  icon: '📝',
  canHaveChildren: false,
  defaultProps: {
    label: 'Detailed Message',
    placeholder: 'type details here...',
    rows: 4,
    hint: 'Give as many details as possible for prompt response.',
    required: false,
  },
  schema: [
    { key: 'label',       type: 'text',   label: 'Textarea Label' },
    { key: 'placeholder', type: 'text',   label: 'Textarea Placeholder' },
    { key: 'rows',        type: 'number', label: 'Box Height (Row lines)' },
    { key: 'hint',        type: 'text',   label: 'Textarea Hint Description' },
    { key: 'required',    type: 'toggle', label: 'Required Field' },
  ],
};

export function Renderer({ props }) {
  return (
    <div className="preview-form-group">
      <label className="preview-form-label">
        {props.label}
        {props.required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
      </label>
      <textarea
        placeholder={props.placeholder}
        className="preview-textarea"
        rows={props.rows}
        readOnly
      />
      {props.hint && <span className="preview-form-hint">{props.hint}</span>}
    </div>
  );
}
