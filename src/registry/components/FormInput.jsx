import React from 'react';

export const config = {
  type: 'FormInput',
  label: 'Form Input',
  group: 'Form Components',
  icon: '📥',
  canHaveChildren: false,
  defaultProps: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'enter your email...',
    hint: 'We will never share your personal email details.',
    required: true,
  },
  schema: [
    { key: 'label',       type: 'text',   label: 'Input Label' },
    { key: 'type',        type: 'select', label: 'HTML Input Type', options: ['text', 'email', 'password', 'number', 'tel', 'date'] },
    { key: 'placeholder', type: 'text',   label: 'Input Placeholder' },
    { key: 'hint',        type: 'text',   label: 'Input Hint Description' },
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
      <input
        type={props.type}
        placeholder={props.placeholder}
        className="preview-form-input"
        readOnly
      />
      {props.hint && <span className="preview-form-hint">{props.hint}</span>}
    </div>
  );
}
