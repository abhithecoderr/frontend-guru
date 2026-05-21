import { useRef, useCallback } from 'react';
import { findNodeInTree } from '../utils/treeUtils.js';
import { findSlotAt, calculateRelativeBounds } from '../utils/dragGeometry.js';

/**
 * Native drag handler — no react-draggable.
 *
 * Drag begins on mousedown IF the node is already selected.
 * Tracks mousemove via document listeners (bypasses touchpad scroll).
 * Dispatches moveNode on mouseup using the same slot-drop geometry as before.
 */
export default function useNodeDrag(node, parentId, wrapperRef, activeTree, actions, isAligned, isLayout, isSelected) {
  const dragState = useRef(null); // null when not dragging

  const handleMouseDown = useCallback((e) => {
    // Only drag with primary mouse button
    if (e.button !== 0) return;
    // Only start dragging if node is already selected
    if (!isSelected) return;
    // Don't interfere with resize handle or buttons
    if (e.target.closest('.node-resize-handle, button, input, textarea, select')) return;

    e.stopPropagation();
    e.preventDefault();

    const el = wrapperRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;

    // Record element's current left/top from its style (set by us each render)
    const startLeft = node.props?.left ?? 50;
    const startTop  = node.props?.top  ?? 50;

    // Full-width layout components can only move vertically
    const widthVal = node.props?.width;
    const isFullWidth = isLayout && (widthVal === 0 || widthVal === undefined);

    dragState.current = {
      startMouseX,
      startMouseY,
      startLeft,
      startTop,
      isFullWidth,
      nodeWidth:  rect.width,
      nodeHeight: rect.height,
      moved: false,
      rafId: null,
      latestMouseX: e.clientX,
      latestMouseY: e.clientY,
    };

    el.classList.add('node-dragging');

    function onMouseMove(moveEvent) {
      const ds = dragState.current;
      if (!ds) return;
      ds.latestMouseX = moveEvent.clientX;
      ds.latestMouseY = moveEvent.clientY;
      ds.moved = true;

      if (ds.rafId) return; // already scheduled
      ds.rafId = requestAnimationFrame(() => {
        const d = dragState.current;
        if (!d || !wrapperRef.current) return;
        d.rafId = null;

        const dx = d.latestMouseX - d.startMouseX;
        const dy = d.latestMouseY - d.startMouseY;
        const newLeft = d.isFullWidth ? d.startLeft : d.startLeft + dx;
        const newTop  = d.startTop + dy;

        // Visual-only update during drag — no React state, no re-render
        wrapperRef.current.style.left = `${newLeft}px`;
        wrapperRef.current.style.top  = `${newTop}px`;
      });
    }

    function onMouseUp(upEvent) {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      const ds = dragState.current;
      dragState.current = null;
      if (!ds) return;

      if (ds.rafId) cancelAnimationFrame(ds.rafId);

      const el2 = wrapperRef.current;
      if (el2) el2.classList.remove('node-dragging');

      if (!ds.moved) return; // just a click, no move action needed

      const dropX = upEvent.clientX;
      const dropY = upEvent.clientY;

      // ── Slot-drop detection (same logic as before) ──
      const slot = findSlotAt(dropX, dropY, node.id);

      if (slot) {
        const slotRect = slot.getBoundingClientRect();
        const { relativeLeft, relativeTop } = calculateRelativeBounds({
          clientX: dropX,
          clientY: dropY,
          containerRect: slotRect,
          elementWidth:  ds.nodeWidth,
          elementHeight: ds.nodeHeight,
          padding: 0,
        });

        const slotIndexAttr = slot.getAttribute('data-slot-index');
        const slotIndex = slotIndexAttr !== null ? parseInt(slotIndexAttr, 10) : undefined;
        const parentWrapper = slot.closest('.node-wrapper');
        const targetParentId = parentWrapper ? parentWrapper.getAttribute('data-node-id') : null;

        if (targetParentId && targetParentId !== node.id) {
          const targetParentNode = findNodeInTree(activeTree, targetParentId);
          const targetSlotProps   = (targetParentNode && slotIndex !== undefined)
            ? targetParentNode.props.slotsProps?.[slotIndex]
            : null;
          const targetSlotAlignX  = targetSlotProps?.alignX || targetParentNode?.props?.defaultSlotAlignX || 'none';
          const targetSlotAlignY  = targetSlotProps?.alignY || targetParentNode?.props?.defaultSlotAlignY || 'none';
          const targetIsAligned   = targetSlotAlignX !== 'none' || targetSlotAlignY !== 'none';

          actions.moveNode({
            id: node.id,
            targetParentId,
            afterId: '__append__',
            props: {
              left:      targetIsAligned ? 0 : relativeLeft,
              top:       targetIsAligned ? 0 : relativeTop,
              slotIndex,
            },
          });
          return;
        }
      }

      // ── Canvas drop ──
      const canvasFrame = document.querySelector('.canvas-frame');
      if (canvasFrame) {
        const canvasRect = canvasFrame.getBoundingClientRect();
        const { relativeLeft, relativeTop } = calculateRelativeBounds({
          clientX: dropX,
          clientY: dropY,
          containerRect: canvasRect,
          elementWidth:  ds.nodeWidth,
          elementHeight: ds.nodeHeight,
          padding: 10,
        });

        actions.moveNode({
          id: node.id,
          targetParentId: null,
          afterId: '__append__',
          props: {
            left:      ds.isFullWidth ? ds.startLeft : relativeLeft,
            top:       relativeTop,
            slotIndex: undefined,
          },
        });
      } else {
        // Fallback: derive position from visual offset already applied
        const dx = dropX - ds.startMouseX;
        const dy = dropY - ds.startMouseY;
        actions.updateProps(node.id, {
          left: ds.isFullWidth ? ds.startLeft : ds.startLeft + dx,
          top:  ds.startTop + dy,
        });
      }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [node, isSelected, isLayout, isAligned, wrapperRef, activeTree, actions]);

  return { handleMouseDown };
}
