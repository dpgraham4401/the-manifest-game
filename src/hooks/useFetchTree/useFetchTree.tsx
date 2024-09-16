import { JsonTree, parseJsonTree } from 'lib/parse';
import { useEffect, useState } from 'react';
import { PositionUnawareDecisionTree } from 'store';

interface UseFetchConfigError {
  message: string;
}

/**
 * This hook is used to fetch the data (json), used to construct the decision tree, from the server.
 */
export const useFetchTree = (configPath: string) => {
  // ToDo: change type of tree useState hook to include falsy values
  const [tree, setTree] = useState<PositionUnawareDecisionTree>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<UseFetchConfigError | undefined>();

  useEffect(() => {
    setIsLoading(true);
    setTree(undefined);
    setError(undefined);
    fetch(configPath)
      .then((response) => response.json() as Promise<JsonTree>)
      .then((data) => {
        try {
          const tree = parseJsonTree(data);
          setTree(tree);
        } catch {
          setError({ message: 'Error Parsing Tree' });
        }
      })
      .catch((_error) => {
        setError({ message: 'Error Fetching the decision tree' });
      })
      .finally(() => setIsLoading(false));
  }, [configPath, setTree, setIsLoading, setError, parseJsonTree]);

  return {
    config: tree,
    isLoading,
    error,
  } as const;
};
