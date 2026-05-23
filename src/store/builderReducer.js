// store/builderReducer.js
import { nanoid } from 'nanoid';
import { REGISTRY } from '../registry/index.js';
import { findNodeWithContext, removeNode, getChildren, insertAfter, applyPatch, reassignIds } from '../utils/treeUtils.js';
import { DEFAULT_PAGE_SETTINGS } from '../utils/defaults.js';

// ── Tree helpers ───────────────────────────────────────

const clone = (v) => JSON.parse(JSON.stringify(v));

// ── Actions that mutate the tree and should push history ──
const HISTORY_ACTIONS = new Set([
  'ADD_NODE', 'REMOVE_NODE', 'MOVE_NODE', 'UPDATE_PROPS', 'BATCH_UPDATE_PROPS',
  'REORDER_NODE', 'DUPLICATE_NODE', 'UPDATE_CANVAS_SETTINGS',
]);

function withTree(state, fn) {
  const pages = clone(state.pages);
  const page = pages.find(p => p.id === state.activePageId);
  if (!page) return state;
  fn(page.tree);
  return { ...state, pages };
}

// ── Reducer ────────────────────────────────────────────

export function builderReducer(state, action) {
  // Push to history before any mutating action
  if (HISTORY_ACTIONS.has(action.type)) {
    state = {
      ...state,
      past: [...state.past.slice(-49), state.pages],
      future: [],
    };
  }

  switch (action.type) {

    case 'UPDATE_PROPS_SILENT': {
      return withTree(state, tree => {
        applyPatch(tree, action.payload.id, action.payload.patch);
      });
    }

    case 'BATCH_UPDATE_PROPS': {
      return withTree(state, tree => {
        action.payload.updates.forEach(({ id, patch }) => {
          applyPatch(tree, id, patch);
        });
      });
    }

    case 'ADD_NODE': {
      const { parentId, afterId, componentType, initialProps } = action.payload;
      const def = REGISTRY[componentType];
      if (!def) return state;
      const activeTreeLength = state.pages.find(p => p.id === state.activePageId)?.tree.length || 0;
      const isLayout = def.group === 'Layout Components';
      const newNode = {
        id: nanoid(8),
        type: componentType,
        props: {
          left: isLayout ? 0 : 50,
          top: 50 + activeTreeLength * 80,
          width: isLayout ? 0 : 350,
          height: isLayout ? 0 : 120,
          ...clone(def.defaultProps),
          ...initialProps
        },
        children: def.canHaveChildren ? [] : undefined,
      };
      return withTree(state, tree => {
        const arr = getChildren(tree, parentId);
        // afterId undefined means canvas fallback → append to end
        if (arr) insertAfter(arr, newNode, afterId !== undefined ? afterId : '__append__');
      });
    }

    case 'REMOVE_NODE': {
      const id = action.payload?.id || state.selectedNodeId;
      if (!id) return state;
      const next = withTree(state, tree => removeNode(tree, id));
      return {
        ...next,
        selectedNodeId: next.selectedNodeId === id ? null : next.selectedNodeId,
      };
    }

    case 'DUPLICATE_NODE': {
      const id = action.payload?.id || state.selectedNodeId;
      if (!id) return state;
      return withTree(state, tree => {
        const found = findNodeWithContext(tree, id);
        if (!found) return;
        const { node, arr, index } = found;
        const dup = clone(node);
        reassignIds(dup);
        arr.splice(index + 1, 0, dup);
      });
    }

    case 'MOVE_NODE': {
      const { id, targetParentId, afterId, props } = action.payload;
      if (id === targetParentId || id === afterId) return state;
      return withTree(state, tree => {
        // Prevent moving a node into its own descendant
        const childSubtree = findNodeWithContext(tree, id);
        if (childSubtree && targetParentId) {
          const isTargetDescendant = findNodeWithContext(childSubtree.node.children || [], targetParentId) !== null;
          if (isTargetDescendant) return;
        }

        const found = findNodeWithContext(tree, id);
        if (!found) return;

        // If moving within the same parent array, check if it's a no-op
        const targetArr = getChildren(tree, targetParentId);
        if (!targetArr) return;

        const idx = targetArr.findIndex(n => n.id === id);
        if (idx !== -1) {
          const prevNode = idx > 0 ? targetArr[idx - 1] : null;
          if (afterId === (prevNode ? prevNode.id : null) && !props) {
            return; // No-op
          }
        }

        const nodeClone = clone(found.node);
        if (props) {
          nodeClone.props = {
            ...nodeClone.props,
            ...props
          };
        }
        removeNode(tree, id);
        insertAfter(targetArr, nodeClone, afterId);
      });
    }

    case 'UPDATE_PROPS': {
      return withTree(state, tree => {
        applyPatch(tree, action.payload.id, action.payload.patch);
      });
    }

    case 'SELECT_NODE':
      return { ...state, selectedNodeId: action.payload.id, selectedSlot: null };

    case 'SELECT_SLOT':
      return {
        ...state,
        selectedNodeId: action.payload.nodeId,
        selectedSlot: { nodeId: action.payload.nodeId, slotIndex: action.payload.slotIndex }
      };

    case 'DESELECT':
      return { ...state, selectedNodeId: null, selectedSlot: null };

    case 'REORDER_NODE': {
      const { id, direction } = action.payload;
      return withTree(state, tree => {
        const found = findNodeWithContext(tree, id);
        if (!found) return;
        const { arr, index } = found;
        const newIdx = direction === 'up' ? index - 1 : index + 1;
        if (newIdx < 0 || newIdx >= arr.length) return;
        [arr[index], arr[newIdx]] = [arr[newIdx], arr[index]];
      });
    }

    case 'ADD_PAGE': {
      const newPage = {
        id: nanoid(8),
        name: action.payload.name || 'New Page',
        tree: [],
        settings: { ...DEFAULT_PAGE_SETTINGS },
      };
      return { ...state, pages: [...state.pages, newPage], activePageId: newPage.id };
    }

    case 'UPDATE_CANVAS_SETTINGS': {
      const pages = state.pages.map(p => {
        if (p.id === state.activePageId) {
          const settings = p.settings || { ...DEFAULT_PAGE_SETTINGS };
          return {
            ...p,
            settings: { ...settings, ...action.payload.patch }
          };
        }
        return p;
      });
      return { ...state, pages };
    }

    case 'REMOVE_PAGE': {
      if (state.pages.length === 1) return state;
      const pages = state.pages.filter(p => p.id !== action.payload.id);
      const activePageId = state.activePageId === action.payload.id ? pages[0].id : state.activePageId;
      return { ...state, pages, activePageId };
    }

    case 'RENAME_PAGE': {
      const pages = state.pages.map(p =>
        p.id === action.payload.id ? { ...p, name: action.payload.name } : p
      );
      return { ...state, pages };
    }

    case 'SET_ACTIVE_PAGE':
      return { ...state, activePageId: action.payload.pageId, selectedNodeId: null, selectedSlot: null };

    case 'SET_VIEWPORT':
      return { ...state, viewport: action.payload.viewport };

    case 'UNDO': {
      if (!state.past.length) return state;
      const previous = state.past[state.past.length - 1];
      return {
        ...state,
        pages: previous,
        past: state.past.slice(0, -1),
        future: [state.pages, ...state.future].slice(0, 50),
        selectedNodeId: null,
        selectedSlot: null,
      };
    }

    case 'REDO': {
      if (!state.future.length) return state;
      const next = state.future[0];
      return {
        ...state,
        pages: next,
        past: [...state.past, state.pages].slice(-50),
        future: state.future.slice(1),
        selectedNodeId: null,
        selectedSlot: null,
      };
    }

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
}
