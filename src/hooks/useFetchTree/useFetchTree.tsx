import { BoolNodeData } from 'components/Tree';
import { useEffect, useState } from 'react';
import { PositionUnawareDecisionTree, TreeNode } from 'store';
import { BooleanVertexData, VertexData } from 'store/TreeSlice/treeSlice';

/** Configuration for an individual node, part of the larger config*/
export interface NodeConfig {
  id: string;
}

interface BooleanNodeConfig extends NodeConfig {
  type: 'BoolNode';
  data: BooleanVertexData;
}

interface DefaultNodeConfig extends NodeConfig {
  type: 'default';
  data: VertexData;
}

/**
 * A JSON serializable array of object that contains all the position unaware
 * nodes in the decision tree, before it is loaded into the store
 */
export interface ConfigFile {
  name: string;
  nodes?: (DefaultNodeConfig | BooleanNodeConfig)[];
}

interface UseFetchConfigError {
  message: string;
}

/** Parses the config file (an array of BoolNodeConfig and DefaultNodeConfig types) and returns a DecisionTree */
const parseConfig = (config: ConfigFile): PositionUnawareDecisionTree => {
  const tree: PositionUnawareDecisionTree = {};
  if (config.nodes === undefined || config.nodes.length === 0) {
    throw new Error('Error Parsing Config');
  }
  config.nodes.forEach((node, index) => {
    if (node.type === 'BoolNode') {
      const { id, data } = node;
      const boolNodeChildren = [data.yesId, data.noId];
      tree[id] = {
        id,
        data: {
          ...data,
          children: boolNodeChildren,
        } as BoolNodeData,
        type: node.type,
        hidden: index !== 0,
      };
    } else {
      const { id, data } = node;
      tree[id] = {
        id,
        data,
        type: node.type,
        hidden: index !== 0,
      } as TreeNode;
    }
  });
  return tree;
};

/**
 * This hook is used to fetch the decision tree from the server.
 */
export const useFetchTree = (configPath: string) => {
  const [config, setConfig] = useState<PositionUnawareDecisionTree>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<UseFetchConfigError | undefined>();

  useEffect(() => {
    setIsLoading(true);
    setConfig(undefined);
    setError(undefined);
    fetch(configPath)
      .then((response) => response.json() as Promise<ConfigFile>)
      .then((data) => {
        try {
          const config = parseConfig(data);
          setConfig(config);
        } catch {
          setError({ message: 'Error Parsing Tree' });
        }
      })
      .catch((error) => {
        setError({ message: `Network error: ${error}` });
      })
      .finally(() => setIsLoading(false));
  }, [configPath]);

  return {
    config,
    isLoading,
    error,
  } as const;
};
