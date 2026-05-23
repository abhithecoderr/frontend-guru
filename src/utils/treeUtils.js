// utils/treeUtils.js
// Shared tree traversal helpers used across Canvas, NodeRenderer, InspectorPanel, and LayersPanel.
// Single source of truth — do not duplicate these in individual files.

import { nanoid } from 'nanoid';

/**
 * Find a node anywhere in the tree by id. Returns the node or null.
 */
export function findNodeInTree(nodes, id) {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children?.length) {
      const found = findNodeInTree(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Find a node by id and also return its parentId. Returns { node, parentId } or null.
 */
export function findNodeById(tree, id, parentId = null) {
  for (const node of tree) {
    if (node.id === id) return { node, parentId };
    if (node.children?.length) {
      const found = findNodeById(node.children, id, node.id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Count all nodes in a tree recursively (including all descendants).
 */
export function countNodes(nodes) {
  let count = 0;
  for (const n of nodes) {
    count++;
    if (n.children?.length) count += countNodes(n.children);
  }
  return count;
}

/**
 * Find the siblings list containing a target node ID. Returns { parentNode, siblings } or null.
 */
export function findSiblings(tree, targetId) {
  if (tree.some(n => n.id === targetId)) {
    return { parentNode: null, siblings: tree };
  }
  for (const n of tree) {
    if (n.children?.some(c => c.id === targetId)) {
      return { parentNode: n, siblings: n.children };
    }
    if (n.children?.length) {
      const found = findSiblings(n.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Find a node in the tree and return its containing parent array and index.
 * Used specifically in reducer operations to support splice and reorder mutations.
 * Returns { node, arr, index } or null.
 */
export function findNodeWithContext(tree, id) {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) return { node: tree[i], arr: tree, index: i };
    if (tree[i].children?.length) {
      const found = findNodeWithContext(tree[i].children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Recursively deletes a node from the tree by its ID.
 */
export function removeNode(tree, id) {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) { tree.splice(i, 1); return true; }
    if (tree[i].children?.length && removeNode(tree[i].children, id)) return true;
  }
  return false;
}

/**
 * Retrieves the children of a node by parentId, or the root tree if parentId is null.
 */
export function getChildren(tree, parentId) {
  if (!parentId) return tree;
  const found = findNodeWithContext(tree, parentId);
  return found?.node?.children ?? null;
}

/**
 * Inserts a node into a flat array based on afterId rules:
 * afterId = null  → prepend (insert at index 0)
 * afterId = id    → insert after that node
 * afterId = '__append__' → push to end
 */
export function insertAfter(arr, node, afterId) {
  if (afterId === null) { arr.unshift(node); return; }
  if (afterId === '__append__') { arr.push(node); return; }
  const idx = arr.findIndex(n => n.id === afterId);
  if (idx === -1) { arr.push(node); return; }
  arr.splice(idx + 1, 0, node);
}

/**
 * Recursively finds a node and merges the property patch.
 */
export function applyPatch(tree, id, patch) {
  const found = findNodeWithContext(tree, id);
  if (found) Object.assign(found.node.props, patch);
}

/**
 * Recursively assigns a new nanoid to every node in a subtree (used during duplicate).
 */
export function reassignIds(node) {
  node.id = nanoid(8);
  if (node.children) node.children.forEach(reassignIds);
}
