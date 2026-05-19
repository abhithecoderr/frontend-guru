// hooks/useDragSource.js
// Wraps HTML5 drag API for items dragged OUT of the sidebar or canvas

/**
 * Returns drag event handlers to attach to a draggable element.
 * @param {'sidebar'|'canvas'} source
 * @param {string} typeOrId  - component type (sidebar) OR node id (canvas)
 */
export function useDragSource(source, typeOrId) {
  const onDragStart = (e) => {
    const target = e.target;

    // Prevent drag if originating from an interactive control inside the component,
    // but ALLOW dragging if they specifically grab the drag handle inside the toolbar.
    if (
      target.tagName === 'BUTTON' ||
      target.closest('button') ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.classList.contains('toggle') ||
      target.closest('.toggle') ||
      (target.closest('.node-toolbar') && !target.closest('.node-toolbar__drag-handle'))
    ) {
      e.preventDefault();
      return;
    }

    e.stopPropagation();
    window.__activeDrag = { source, value: typeOrId };
    const payload = JSON.stringify({ source, value: typeOrId });
    e.dataTransfer.setData('application/x-builder', payload);
    e.dataTransfer.effectAllowed = 'move';

    // Visual feedback: mark the draggable element itself as being dragged
    setTimeout(() => {
      const wrapper = e.currentTarget;
      if (wrapper) {
        wrapper.classList.add('dragging');
      }
    }, 0);
  };

  const onDragEnd = (e) => {
    window.__activeDrag = null;
    const wrapper = e.currentTarget;
    if (wrapper) {
      wrapper.classList.remove('dragging');
    }
  };

  return { draggable: true, onDragStart, onDragEnd };
}
