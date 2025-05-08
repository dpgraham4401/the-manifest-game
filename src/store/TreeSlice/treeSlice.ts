import { layoutTree } from '@/store/TreeSlice/layout';
import {
  getAncestorIds,
  getParentId,
  setNodesHidden,
  setNodeVisible,
} from '@/store/TreeSlice/treeSliceUtils';
import { Node } from 'reactflow';
import { StateCreator } from 'zustand';

/** Data needed by all nodes in our tree*/
export interface VertexData {
  label: string;
  children: string[];
  help?: string;
}

/** data needed by the BooleanTreeNode to render decisions*/
export interface BooleanVertexData extends VertexData {
  yesId: string;
  noId: string;
}

/** A vertex in our decision tree.*/
export interface Vertex extends Omit<Node, 'position'> {
  data: VertexData | BooleanVertexData;
  position: { x: number; y: number; rank?: number };
}

/**
 * A decision tree is a map of all node IDs to TreeNodes
 * There may be some performance optimizations to be made here by using a Map instead of a Object
 */
export type DecisionTree = Record<string, Vertex>;

export type PositionUnawareDecisionTree = Record<string, Omit<Vertex, 'position'>>;

export type TreeDirection = 'TB' | 'LR';

export interface Decision {
  nodeId: string;
  selected: string;
}

export type DecisionPath = Decision[];

interface TreeSliceState {
  tree: DecisionTree;
  direction: TreeDirection;
  path: DecisionPath;
}

interface TreeSliceActions {
  /** build and Set the decision tree from a config. It acts as the database we build nodes from*/
  setDecisionTree: (tree: PositionUnawareDecisionTree) => void;
  /** Set the layout direction */
  setTreeDirection: (direction: TreeDirection) => void;
  /** Set vertex as visible */
  setVertexVisible: (nodeId: string) => void;
  /** Set decision as hidden */
  setVertexHidden: (nodeId: string) => void;
  /** set the path of the decision */
  setPath: (path: DecisionPath) => void;
  /** get the decision path */
  getPath: () => DecisionPath;
  /** remove a decision by node ID and all its children */
  removePathDecision: (nodeId: string) => void;
  /** get ancestor IDs */
  getAncestorDecisions: (nodeId: string) => string[];
  /** get a node's parent ID */
  getParentVertexId: (nodeId: string) => string | undefined;
}

export interface TreeSlice extends TreeSliceActions, TreeSliceState {}

export const createTreeSlice: StateCreator<
  TreeSlice,
  [['zustand/devtools', never]],
  [],
  TreeSlice
> = (set, get) => ({
  direction: 'LR',
  tree: {},
  path: [],
  setTreeDirection: (direction: TreeDirection) => {
    set({ tree: layoutTree(get().tree, direction), direction }, false, 'setTreeDirection');
  },
  setDecisionTree: (tree: PositionUnawareDecisionTree) => {
    set({ tree: layoutTree(tree) }, false, 'setNewTree');
  },
  // ToDO: Remove this and corresponding state
  setVertexVisible: (nodeId: string) => {
    set(
      {
        tree: setNodeVisible(get().tree, [nodeId]),
      },
      false,
      'setVertexVisible'
    );
  },
  // ToDO: Remove this and corresponding state
  setVertexHidden: (nodeId: string) => {
    set(
      {
        tree: setNodesHidden(get().tree, [nodeId]),
      },
      false,
      'setVertexHidden'
    );
  },
  setPath: (path: DecisionPath) => {
    set(
      {
        path,
      },
      false,
      'setPath'
    );
  },
  getPath: () => get().path,
  removePathDecision: (nodeId: string) => {
    const path = get().path;
    const decisionIndex = path.findIndex((decision) => decision.nodeId == nodeId);
    if (decisionIndex === -1) return;
    const newPath = path.slice(0, decisionIndex);
    set(
      {
        path: newPath,
      },
      false,
      'removeDecisionFromPath'
    );
  },
  getAncestorDecisions: (nodeId: string) => {
    const tree = get().tree;
    return getAncestorIds(tree, nodeId);
  },
  getParentVertexId: (nodeId: string) => {
    const tree = get().tree;
    return getParentId(tree, nodeId);
  },
});
