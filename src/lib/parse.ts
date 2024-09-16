import { BoolNodeData } from 'components/Tree';
import { PositionUnawareDecisionTree } from 'store';
import { PositionUnawareTreeNode } from 'store/DagNodeSlice/dagNodeSlice';
import { BooleanVertexData, VertexData } from 'store/TreeSlice/treeSlice';

/** Base object members in the JSON file used to construct the tree*/
interface BaseNodeData {
  id: string;
}

/** Data to construct a Yes/No question */
interface BooleanNodeData extends BaseNodeData {
  type: 'BoolNode';
  data: BooleanVertexData;
}

/** Data to construct a default node (a node with info, no question or options) */
interface DefaultNodeData extends BaseNodeData {
  type: 'default';
  data: VertexData;
}

/**
 * A JSON serializable array of object that contains all the position unaware
 * nodes in the decision tree, before it is loaded into the store
 */
export interface JsonTree {
  name: string;
  nodes?: (DefaultNodeData | BooleanNodeData)[];
}

/** Parses the boolean node data and returns a PositionUnawareTreeNode */
const parseBooleanNodeData = (node: BooleanNodeData, hidden = true): PositionUnawareTreeNode => {
  const boolNodeChildren = [node.data.yesId, node.data.noId];
  return {
    id: node.id,
    data: {
      ...node.data,
      children: boolNodeChildren,
    } as BoolNodeData,
    type: node.type,
    hidden,
  };
};

const parseDefaultNodeData = (node: DefaultNodeData, hidden = true): PositionUnawareTreeNode => ({
  id: node.id,
  data: node.data,
  type: node.type,
  hidden,
});

/** Parses the parse json tree file and returns a DecisionTree */
export const parseJsonTree = (config: JsonTree): PositionUnawareDecisionTree => {
  const tree: PositionUnawareDecisionTree = {};
  if (config.nodes === undefined || config.nodes.length === 0) {
    throw new Error('Error construction decision tree');
  }
  config.nodes.forEach((node, index) => {
    if (node.type === 'BoolNode') {
      tree[node.id] = parseBooleanNodeData(node, index !== 0);
    } else {
      tree[node.id] = parseDefaultNodeData(node, index !== 0);
    }
  });
  return tree;
};
