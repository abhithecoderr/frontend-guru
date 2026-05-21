import { getDefinition } from '../registry/index.js';
import { findNodeInTree } from '../utils/treeUtils.js';
import { findSlotAt, calculateRelativeBounds } from '../utils/dragGeometry.js';

/**
 * Custom hook to handle dropping sidebar components onto specific slots or root canvas.
 * Leverages shared geometry math helper to avoid duplicate collision math.
 */
export default function useCanvasDrop(frameRef, activeTree, actions) {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/x-builder');
    if (!raw) return;
    try {
      const { source, value } = JSON.parse(raw);

      if (source === 'sidebar') {
        const rect = frameRef.current.getBoundingClientRect();
        const def = getDefinition(value);
        const isLayout = def?.group === 'Layout Components';

        const clientX = e.clientX;
        const clientY = e.clientY;

        const defaultWidth = isLayout ? 0 : 350;
        const defaultHeight = isLayout ? 0 : 120;

        // Detect if drop occurred over an active layout slot or section block using shared helper
        const slot = findSlotAt(clientX, clientY);

        if (slot) {
          const slotRect = slot.getBoundingClientRect();
          const { relativeLeft, relativeTop } = calculateRelativeBounds({
            clientX,
            clientY,
            containerRect: slotRect,
            elementWidth: defaultWidth,
            elementHeight: defaultHeight,
            padding: 0
          });

          const slotIndexAttr = slot.getAttribute('data-slot-index');
          const slotIndex = slotIndexAttr !== null ? parseInt(slotIndexAttr, 10) : undefined;

          const parentWrapper = slot.closest('.node-wrapper');
          const parentId = parentWrapper ? parentWrapper.getAttribute('data-node-id') : null;

          if (parentId) {
            const parentNode = findNodeInTree(activeTree, parentId);
            const slotProps = (parentNode && slotIndex !== undefined) ? parentNode.props.slotsProps?.[slotIndex] : null;
            const slotAlignX = slotProps?.alignX || parentNode?.props?.defaultSlotAlignX || 'none';
            const slotAlignY = slotProps?.alignY || parentNode?.props?.defaultSlotAlignY || 'none';
            const isAligned = slotAlignX !== 'none' || slotAlignY !== 'none';

            actions.addNode({
              parentId,
              afterId: '__append__',
              componentType: value,
              initialProps: {
                left: isAligned ? 0 : relativeLeft,
                top: isAligned ? 0 : relativeTop,
                width: defaultWidth,
                height: defaultHeight,
                slotIndex,
              }
            });
            return;
          }
        }

        // Canvas fallback drop using shared helper
        const { relativeLeft, relativeTop } = calculateRelativeBounds({
          clientX,
          clientY,
          containerRect: rect,
          elementWidth: defaultWidth,
          elementHeight: defaultHeight,
          padding: 10
        });

        actions.addNode({
          parentId: null,
          afterId: '__append__',
          componentType: value,
          initialProps: {
            left: isLayout ? 0 : relativeLeft,
            top: relativeTop,
            width: defaultWidth,
            height: defaultHeight,
          }
        });
      }
    } catch { /* ignore */ }
  };

  return { handleDragOver, handleDrop };
}
