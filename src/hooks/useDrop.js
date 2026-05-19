// hooks/useDrop.js
import { useState, useCallback } from 'react';
import { useBuilder } from '../store/BuilderContext.jsx';

/**
 * @param {string|null}      parentId  - parent node id (null = root)
 * @param {string|null}      afterId   - insert after this node (null = prepend, '__append__' = end)
 * @param {boolean}          isCanvas  - true for the root canvas fallback handler
 */
export function useDrop(parentId = null, afterId = null, isCanvas = false) {
  const { actions } = useBuilder();
  const [isOver, setIsOver] = useState(false);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsOver(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    setIsOver(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation(); // stop canvas fallback from double-firing
    setIsOver(false);

    const raw = e.dataTransfer.getData('application/x-builder');
    if (!raw) return;

    try {
      const { source, value } = JSON.parse(raw);
      if (source === 'sidebar') {
        actions.addNode({ parentId, afterId, componentType: value });
      } else if (source === 'canvas') {
        if (value !== parentId) {
          actions.moveNode({ id: value, targetParentId: parentId, afterId });
        }
      }
    } catch {
      /* malformed */
    }
  }, [actions, parentId, afterId]);

  return { isOver, onDragOver, onDragLeave, onDrop };
}
