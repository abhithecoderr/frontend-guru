import React from 'react';
import './TextHeading.css';

export const config = {
  type: 'TextHeading',
  label: 'Text / Heading',
  group: 'Content Primitives',
  icon: '🔤',
  canHaveChildren: false,
  defaultProps: {
    content: 'Type some text here...',
    tag: 'h2',
    color: '#f4f4f5',
    align: 'left',
    fontWeight: '600',
    italic: false,
  },
  schema: [
    { key: 'content',    type: 'textarea', label: 'Content' },
    { key: 'tag',        type: 'select',   label: 'HTML Tag',      options: ['h1', 'h2', 'h3', 'h4', 'p', 'span'] },
    { key: 'color',      type: 'color',    label: 'Text Color' },
    { key: 'align',      type: 'select',   label: 'Alignment',     options: ['left', 'center', 'right', 'justify'] },
    { key: 'fontWeight', type: 'select',   label: 'Font Weight',   options: ['300', '400', '500', '600', '700', '800'] },
    { key: 'italic',     type: 'toggle',   label: 'Italic Styles' },
  ],
};

export function Renderer({ props }) {
  const Tag = props.tag || 'p';
  const style = {
    color: props.color,
    textAlign: props.align,
    fontWeight: props.fontWeight,
    fontStyle: props.italic ? 'italic' : 'normal',
  };
  return <Tag className={`preview-text-block tag-${props.tag}`} style={style}>{props.content}</Tag>;
}
