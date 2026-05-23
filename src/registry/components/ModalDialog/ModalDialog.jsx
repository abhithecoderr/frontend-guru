import React, { useState } from 'react';
import './ModalDialog.css';

export const config = {
  type: 'ModalDialog',
  label: 'Modal Dialog',
  group: 'Form Components',
  icon: '💬',
  canHaveChildren: false,
  defaultProps: {
    triggerLabel: 'Open Dialog',
    triggerVariant: 'primary',
    title: 'Are you absolutely sure?',
    body: 'This action will completely clean up workarounds and combine your components into modern consolidated packages.',
    cancelLabel: 'Cancel',
    confirmLabel: 'Confirm Upgrade',
  },
  schema: [
    { key: 'triggerLabel',   type: 'text',   label: 'Trigger Button Label' },
    { key: 'triggerVariant', type: 'select', label: 'Trigger Button Variant', options: ['primary', 'secondary', 'outline'] },
    { key: 'title',          type: 'text',   label: 'Modal Title Header' },
    { key: 'body',           type: 'textarea', label: 'Modal Dialog Body Paragraph' },
    { key: 'cancelLabel',    type: 'text',   label: 'Cancel Button Label' },
    { key: 'confirmLabel',   type: 'text',   label: 'Confirm Button Label' },
  ],
};

export function Renderer({ props }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="preview-modal-trigger-area">
        <button
          className={`preview-btn preview-btn--${props.triggerVariant} preview-btn--md`}
          onClick={() => setOpen(true)}
        >
          {props.triggerLabel}
        </button>
        <span className="preview-modal-hint">Click to preview modal</span>
      </div>

      {open && (
        <div className="preview-modal-overlay" onClick={() => setOpen(false)}>
          <div className="preview-modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="preview-modal-header">
              <h2 className="preview-modal-title">{props.title}</h2>
              <button className="preview-modal-close" onClick={() => setOpen(false)}>✕</button>
            </div>
            <p className="preview-modal-body">{props.body}</p>
            <div className="preview-modal-footer">
              <button className="preview-btn preview-btn--outline preview-btn--sm" onClick={() => setOpen(false)}>{props.cancelLabel}</button>
              <button className="preview-btn preview-btn--primary preview-btn--sm" onClick={() => setOpen(false)}>{props.confirmLabel}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
