import { useState } from 'react';
import { findSiblings } from '../utils/treeUtils.js';

/**
 * Custom hook to handle HTML5 drag-and-drop reordering inside the Layers panel.
 * Decouples complex list sorting and z-index calculation from LayersPanel.jsx.
 */
export default function useLayersDnd(node, activeTree, actions) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', node.id);
    e.dataTransfer.effectAllowed = 'move';
    e.stopPropagation();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragEnd = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId === node.id) return;

    // Call central tree helper
    const res = findSiblings(activeTree, node.id);
    if (!res) return;
    const { siblings } = res;

    // Ensure the dragged node is one of the siblings to permit standard stack swap
    const hasDraggedSibling = siblings.some(s => s.id === draggedId);
    if (!hasDraggedSibling) return;

    // Sort siblings by zIndex descending
    const sortedSiblings = [...siblings].sort((a, b) => (b.props?.zIndex ?? 1) - (a.props?.zIndex ?? 1));

    const draggedIdx = sortedSiblings.findIndex(s => s.id === draggedId);
    const targetIdx = sortedSiblings.findIndex(s => s.id === node.id);
    if (draggedIdx === -1 || targetIdx === -1) return;

    // Reorder siblings
    const reordered = [...sortedSiblings];
    const [draggedNode] = reordered.splice(draggedIdx, 1);
    reordered.splice(targetIdx, 0, draggedNode);

    // Map zIndex values sequentially based on new reordered position (highest at the top)
    const updates = reordered.map((s, idx) => {
      const newZ = reordered.length - idx;
      return {
        id: s.id,
        patch: { zIndex: newZ }
      };
    });

    actions.batchUpdateProps(updates);
  };

  return {
    isDragOver,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDragEnd,
    handleDrop
  };
}
