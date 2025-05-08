import { HelpIcon } from '@/components/Help/HelpIcon/HelpIcon';
import { BaseNode } from '@/components/Tree/Nodes/BaseNode/BaseNode';
import { BoolButton } from '@/components/Tree/Nodes/BoolNode/BoolButton/BoolButton';
import { useDecisionTree, useHelp } from '@/hooks';
import { useDecisions } from '@/hooks/useDecisions/useDecisions';
import { VertexData } from '@/store/TreeSlice/treeSlice';
import React, { MouseEventHandler } from 'react';
import { NodeProps } from 'reactflow';

export interface BoolNodeData extends VertexData {
  label: string;
  yesId: string;
  noId: string;
  children: string[];
}

export const BoolNode = ({
  data: { yesId, noId, label, help, ...restOfData },
  id,
  ...props
}: NodeProps<BoolNodeData>) => {
  const { showHelp } = useHelp();
  const { retractDecision, makeDecision } = useDecisionTree();
  const { decisionIsInPath, decision } = useDecisions(id);
  console.log(restOfData);

  const handleHelpClick: MouseEventHandler = (event) => {
    try {
      showHelp(help);
      event.stopPropagation();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAnswer = (answer: boolean) => (event: React.MouseEvent<HTMLButtonElement>) => {
    retractDecision(answer ? noId : yesId);
    makeDecision(id, answer ? yesId : noId);
    event.stopPropagation();
  };

  return (
    <BaseNode {...props} id={id}>
      <div
        data-testid={`bool-node-${id}-content`}
        className={`relative min-w-80 rounded-xl p-4 ${decisionIsInPath(id) ? 'bg-green-900' : 'bg-rcraBlue'}`}
      >
        {help && (
          <div className="absolute right-3 top-3">
            <HelpIcon onClick={handleHelpClick} />
          </div>
        )}
        <div className="flex flex-col items-center justify-center pe-3 pt-3 text-xl text-white">
          <div>
            <h2 className="m-2 pb-4 text-2xl">{label}</h2>
          </div>
          <div className="mt-1 flex items-center justify-center space-x-3">
            <BoolButton
              id={id}
              selected={decision?.selected === yesId}
              response={true}
              onClick={handleAnswer(true)}
            />
            <BoolButton
              id={id}
              selected={decision?.selected === noId}
              response={false}
              onClick={handleAnswer(false)}
            />
          </div>
        </div>
      </div>
    </BaseNode>
  );
};
