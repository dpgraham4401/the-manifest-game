import { useDAG } from 'hooks/useDAG/useDAG';
import { NodeMouseHandler } from 'reactflow';
import { PositionUnawareDecisionTree } from 'store/DagSlice/dagSlice';

/**
 * useDecisionTree
 *
 * Returns an array of nodes & edges to be used with the ReactFlow library
 * @param initialTree
 */
export const useDecisionTree = (initialTree?: PositionUnawareDecisionTree) => {
  const { hideDescendants, showChildren, edges, nodes, hideNiblings } = useDAG(initialTree);

  /** handle node click events */
  const onClick: NodeMouseHandler = (_event, node) => {
    switch (node.type) {
      case 'BoolNode':
        return null; // offload click handling to the BoolNode component
      default:
        if (!node.data.expanded) {
          showChildren(node.id);
          hideNiblings(node.id);
        } else {
          hideDescendants(node.id);
        }
    }
  };

  return {
    nodes,
    edges,
    onClick,
  } as const;
};
