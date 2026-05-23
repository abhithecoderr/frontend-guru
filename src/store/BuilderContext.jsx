// store/BuilderContext.jsx
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { builderReducer } from './builderReducer.js';
import { initialState } from '../utils/defaults.js';

const STORAGE_KEY = 'frontend-guru-state';

const BuilderContext = createContext(null);

// Strip history arrays before saving to avoid bloated localStorage
function serializeForStorage(state) {
  const { past, future, ...rest } = state;
  return rest;
}

function loadFromStorage(init) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return init;
    const parsed = JSON.parse(saved);
    return { ...init, ...parsed, past: [], future: [] };
  } catch {
    return init;
  }
}

export function BuilderProvider({ children }) {
  const [state, dispatch] = useReducer(builderReducer, initialState, loadFromStorage);

  // Persist (without history arrays) — debounced to avoid serializing on every drag frame
  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeForStorage(state)));
    }, 300);
    return () => clearTimeout(id);
  }, [state]);

  // ── Global keyboard shortcuts ───────────────────────
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      const el  = document.activeElement;
      // Don't fire shortcuts when typing in a text field or adjusting a control
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        el?.isContentEditable ||
        el?.closest('[contenteditable]')
      ) return;

      if (e.key === 'Escape') {
        dispatch({ type: 'DESELECT' });
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        dispatch({ type: 'REMOVE_NODE' });
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        dispatch({ type: 'DUPLICATE_NODE' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Derived
  const activePage = state.pages.find(p => p.id === state.activePageId);
  const activeTree = activePage?.tree ?? [];

  const actions = {
    // Node operations
    addNode: useCallback((payload) => dispatch({ type: 'ADD_NODE', payload }), []),

    removeNode: useCallback((id) => dispatch({ type: 'REMOVE_NODE', payload: { id } }), []),

    duplicateNode: useCallback((id) => dispatch({ type: 'DUPLICATE_NODE', payload: { id } }), []),

    moveNode: useCallback((payload) => dispatch({ type: 'MOVE_NODE', payload }), []),

    reorderNode: useCallback((id, dir) => dispatch({ type: 'REORDER_NODE', payload: { id, direction: dir } }), []),

    updateProps: useCallback((id, patch) => dispatch({ type: 'UPDATE_PROPS', payload: { id, patch } }), []),

    updatePropsSilent: useCallback((id, patch) => dispatch({ type: 'UPDATE_PROPS_SILENT', payload: { id, patch } }), []),

    batchUpdateProps: useCallback((updates) => dispatch({ type: 'BATCH_UPDATE_PROPS', payload: { updates } }), []),

    // Selection
    selectNode: useCallback((id) => dispatch({ type: 'SELECT_NODE', payload: { id } }), []),

    selectSlot: useCallback((nodeId, slotIndex) => dispatch({ type: 'SELECT_SLOT', payload: { nodeId, slotIndex } }), []),

    deselect: useCallback(() => dispatch({ type: 'DESELECT' }), []),

    // Page operations
    addPage: useCallback((name) => dispatch({ type: 'ADD_PAGE', payload: { name } }), []),

    removePage: useCallback((id) => dispatch({ type: 'REMOVE_PAGE', payload: { id } }), []),

    renamePage: useCallback((id, name) => dispatch({ type: 'RENAME_PAGE', payload: { id, name } }), []),

    setActivePage: useCallback((pageId) => dispatch({ type: 'SET_ACTIVE_PAGE', payload: { pageId } }), []),

    // Canvas & Viewport settings
    updateCanvasSettings: useCallback((patch) => dispatch({ type: 'UPDATE_CANVAS_SETTINGS', payload: { patch } }), []),

    setViewport: useCallback((viewport) => dispatch({ type: 'SET_VIEWPORT', payload: { viewport } }), []),

    // History and State controls
    undo: useCallback(() => dispatch({ type: 'UNDO' }), []),

    redo: useCallback(() => dispatch({ type: 'REDO' }), []),

    resetState: useCallback(() => {
      localStorage.removeItem(STORAGE_KEY);
      dispatch({ type: 'LOAD_STATE', payload: initialState });
    }, []),
  };

  return (
    <BuilderContext.Provider value={{ state, activeTree, activePage, actions }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilder must be used inside BuilderProvider');
  return ctx;
}
