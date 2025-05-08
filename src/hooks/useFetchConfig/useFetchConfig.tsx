import { BoolNodeData } from '@/components/Tree';
import { PositionUnawareDecisionTree, TreeNode } from '@/store';
import { BooleanVertexData, VertexData } from '@/store/TreeSlice/treeSlice';
import { useEffect, useState } from 'react';

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

const buildTree = (
  nodes: (DefaultNodeConfig | BooleanNodeConfig)[],
  k = 0
): PositionUnawareDecisionTree => {
  if (k >= nodes.length) return {};

  const node = nodes[k];
  const { id, data, type } = node;

  const tree: PositionUnawareDecisionTree = {
    [id]: {
      id,
      data: {
        ...data,
        children: type === 'BoolNode' ? [data.yesId, data.noId] : data.children || [],
      },
      type,
      hidden: k !== 0,
      uid: k,
    } as TreeNode | BoolNodeData,
  };

  if (type === 'BoolNode') {
    const [yesId, noId] = [data.yesId, data.noId];
    const yesIndex = nodes.findIndex((n) => n.id === yesId);
    const noIndex = nodes.findIndex((n) => n.id === noId);

    if (yesIndex !== -1) {
      Object.assign(tree, buildTree(nodes, yesIndex));
    }
    if (noIndex !== -1) {
      Object.assign(tree, buildTree(nodes, noIndex));
    }
  }

  return tree;
};

// Usage
const parseConfig = (config: ConfigFile): PositionUnawareDecisionTree => {
  if (!config.nodes || config.nodes.length === 0) {
    throw new Error('Error Parsing Config');
  }
  return buildTree(config.nodes);
};

/**
 * This hook is used to fetch the config from the server.
 */
export const useFetchConfig = (configPath: string) => {
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
          setError({ message: 'Error Parsing Config' });
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
