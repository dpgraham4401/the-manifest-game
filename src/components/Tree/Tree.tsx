import { ControlCenter } from '@/components/Tree/ControlCenter';
import { DecisionEdge } from '@/components/Tree/Edges/DecisionEdge/DecisionEdge';
import { BoolNode } from '@/components/Tree/Nodes/BoolNode/BoolNode';
import { DefaultNode } from '@/components/Tree/Nodes/DefaultNode/DefaultNode';
import { useDecisionTree, useTreeDirection } from '@/hooks';
import React, { useMemo, useState } from 'react';
import ReactFlow, { Edge, MiniMap, Node, useReactFlow, useViewport, XYPosition } from 'reactflow';

export interface TreeProps {
  nodes: Node[];
  edges: Edge[];
  mapVisible?: boolean;
}

const edgeTypes = {
  decision: DecisionEdge,
};

/**
 * Tree - responsible for rendering the decision tree
 */
export const Tree = ({ nodes, edges }: TreeProps) => {
  const nodeTypes = useMemo(() => ({ BoolNode: BoolNode, default: DefaultNode }), []);
  const { onNodesChange, onEdgesChange } = useDecisionTree();
  const [mapVisible, setMapVisible] = useState(true);
  const [direction, setDirection] = useTreeDirection();
  const { setCenter } = useReactFlow();
  const { zoom } = useViewport();

  return (
    <>
      <main style={{ width: '100%', height: '100%' }} data-testid="decision-tree">
        <ReactFlow
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodes={nodes}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onNodesChange={onNodesChange}
          fitView
          edgesFocusable={false}
          fitViewOptions={{ padding: 5, minZoom: 0, maxZoom: 2 }}
          proOptions={{ hideAttribution: true }}
        >
          {mapVisible && (
            <MiniMap
              ariaLabel="Mini Map"
              offsetScale={50}
              data-testid="tree-mini-map"
              nodeColor="#3E6D9BAA"
              zoomable={true}
              onClick={(_event: React.MouseEvent, position: XYPosition) =>
                setCenter(position.x, position.y, { zoom: zoom })
              }
            />
          )}
          <ControlCenter
            mapVisible={mapVisible}
            setMapVisible={setMapVisible}
            direction={direction}
            setDirection={setDirection}
          />
        </ReactFlow>
      </main>
    </>
  );
};
