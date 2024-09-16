import defaultTree from '/default.json?url';
import { ErrorMsg } from 'components/Error';
import { Header } from 'components/Header/Header';
import { OffCanvas } from 'components/OffCanvas/OffCanvas';
import { Spinner } from 'components/Spinner/Spinner';
import { Tree } from 'components/Tree/Tree';
import { useDecisionTree, useFetchTree } from 'hooks';
import { useHelp } from 'hooks/useHelp/useHelp';
import { useUrl } from 'hooks/useUrl/useUrl';

/**
 * App - responsible for rendering the decision tree
 * @constructor
 */
export default function App() {
  const title = import.meta.env.VITE_APP_TITLE ?? 'The Manifest Game';
  const { config, isLoading: configIsLoading, error: configError } = useFetchTree(defaultTree);
  const { pathParam } = useUrl();
  const { nodes, edges } = useDecisionTree(config, pathParam);
  const { helpIsOpen, hideHelp } = useHelp();

  return (
    <>
      <Header treeTitle={title} />
      {configIsLoading ? (
        <Spinner />
      ) : configError ? (
        <ErrorMsg message={'Error parsing the Decision Tree'} />
      ) : (
        <Tree nodes={nodes} edges={edges} />
      )}
      <OffCanvas isOpen={helpIsOpen} onClose={hideHelp} />
    </>
  );
}
