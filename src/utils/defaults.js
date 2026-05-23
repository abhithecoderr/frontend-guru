// utils/defaults.js

export const DEFAULT_PAGE_SETTINGS = {
  bgColor: '#09090b',
  fontFamily: 'Inter',
  paddingTop: 40,
  paddingBottom: 40,
  canvasHeight: 650,
  layoutMode: 'flow',
};

export const initialState = {
  pages: [{
    id: 'page-1',
    name: 'Home',
    tree: [],
    settings: { ...DEFAULT_PAGE_SETTINGS },
  }],
  activePageId: 'page-1',
  selectedNodeId: null,
  selectedSlot: null,
  viewport: 'desktop',
  past: [],    // array of pages snapshots for undo
  future: [],  // array of pages snapshots for redo
};
