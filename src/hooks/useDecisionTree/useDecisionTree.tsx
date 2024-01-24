import { useTreeNodes } from 'hooks/useTreeNodes/useTreeNodes';
import { useEffect } from 'react';
import { NodeMouseHandler } from 'reactflow';
import { buildTreeEdges } from 'services/tree/treeService';
import { DecisionTree, useTreeStore } from 'store';

/**
 * useManifestTree
 *
 * logic and interface for managing the interactive e-Manifest decision tree
 * returns an array of nodes to be used with the React Flow library and getter/setter functions
 * @param initialTree
 */
export const useDecisionTree = (initialTree: DecisionTree) => {
  const { nodes, tree } = useTreeNodes(initialTree);

  const { edges, setEdges } = useTreeStore((state) => ({
    edges: state.edges,
    setEdges: state.setEdges,
  }));

  useEffect(() => {
    setEdges(buildTreeEdges(tree));
  }, [tree, setEdges]);

  const onClick: NodeMouseHandler = (event, node) => {
    console.log('onClick', node);
  };
  // const onClick: NodeMouseHandler = useCallback(
  //   (event: MouseEvent, node: ManifestNode) => {
  //     console.log('onClick', node);
  //     if (node.expanded) {
  //       // if node is open, close it and hide all children
  //       const childrenIds = Tree.getRecursiveChildrenIds(tree, node.id);
  //       const newTree = { ...tree };
  //       newTree[node.id] = { ...node, expanded: false };
  //       childrenIds.forEach((id) => {
  //         newTree[id].hidden = true;
  //         newTree[id].expanded = false;
  //       });
  //       setTree(newTree);
  //       setEdges(
  //         Tree.setHiddenEdges({
  //           edges,
  //           targetNodeIds: childrenIds,
  //           hidden: true,
  //         })
  //       );
  //     } else {
  //       // if node is closed, open it and show direct children
  //       const childrenIds = Tree.getChildrenIds({ tree, id: node.id });
  //       setTree(Tree.expandNode({ tree, node }));
  //       setEdges(
  //         Tree.setHiddenEdges({
  //           edges,
  //           targetNodeIds: childrenIds,
  //           hidden: false,
  //         })
  //       );
  //     }
  //   },
  //   [tree, setTree, setEdges, edges]
  // );

  return {
    nodes,
    edges,
    onClick,
  } as const;
};
