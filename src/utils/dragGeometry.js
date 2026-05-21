/**
 * Helper utility to find drop zones and calculate relative bounding offsets.
 * Used to unify drag-and-drop mechanics across Canvas drops and component drags.
 */

/**
 * Scan screen layout slots and container groups to detect drop collisions.
 * Returns the best matching DOM element or null.
 */
export function findSlotAt(clientX, clientY, excludeNodeId = null) {
  const targets = document.querySelectorAll('.layout-slot, .layout-container.section-block');
  
  let bestSlot = null;
  let bestArea = 0;
  
  for (const slot of targets) {
    if (excludeNodeId) {
      // Prevent dropping a component inside its own children slot
      const parentWrapper = slot.closest(`.node-wrapper[data-node-id="${excludeNodeId}"]`);
      if (parentWrapper) continue;
    }
    
    const rect = slot.getBoundingClientRect();
    if (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    ) {
      const area = rect.width * rect.height;
      if (!bestSlot || area < bestArea) {
        bestSlot = slot;
        bestArea = area;
      }
    }
  }
  return bestSlot;
}

/**
 * Calculates clamped relative offsets (left/top) for an element dropping inside a container.
 */
export function calculateRelativeBounds({
  clientX,
  clientY,
  containerRect,
  elementWidth,
  elementHeight,
  padding = 0,
}) {
  let relativeLeft = Math.round(clientX - containerRect.left - (elementWidth / 2));
  let relativeTop = Math.round(clientY - containerRect.top - (elementHeight / 2));

  // Clamp within the container boundaries, accounting for padding
  const maxLeft = Math.max(padding, containerRect.width - elementWidth - padding);
  const maxTop = Math.max(padding, containerRect.height - elementHeight - padding);

  relativeLeft = Math.max(padding, Math.min(maxLeft, relativeLeft));
  relativeTop = Math.max(padding, Math.min(maxTop, relativeTop));

  return { relativeLeft, relativeTop };
}
