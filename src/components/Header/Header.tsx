import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useHelp } from '@/hooks';
import React, { MouseEventHandler } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { FaBug } from 'react-icons/fa6';
import { LuMenu } from 'react-icons/lu';
import { Panel } from 'reactflow';

interface HeaderProps {
  treeTitle: string;
}

export const Header = ({ treeTitle }: HeaderProps) => {
  const options = import.meta.env.VITE_TREE_FILES.split(',');
  const [treeFile, setTreeFile] = React.useState(
    options.filter((option) => option.includes('default.json'))[0]
  );
  const issueUrl = import.meta.env.VITE_ISSUE_URL;
  const { showHelp } = useHelp();

  const showInstructions: MouseEventHandler = (event) => {
    try {
      showHelp('guide.html');
      event.stopPropagation();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Panel position="top-center" className="mx-0 w-full">
      <div className="mx-2 box-border min-w-80 rounded-xl bg-rcraBlue p-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">{treeTitle}</h1>
          <div className="">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full border-none bg-transparent p-2 text-white hover:bg-slate-400"
                  name="menu"
                  aria-label="menu"
                >
                  <LuMenu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mx-4">
                <DropdownMenuLabel>Help</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={showInstructions}>
                  <FaQuestionCircle className="mr-2 size-4" />
                  <span>How to use</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {issueUrl && (
                    <>
                      <FaBug className="mr-2 size-4" />
                      <div>
                        <a href={issueUrl} className="text-sm underline decoration-1">
                          Feedback/Report and Issue
                        </a>
                      </div>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Decision Tree</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuLabel>Tree Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup value={treeFile} onValueChange={setTreeFile}>
                        {options.map((option) => (
                          <DropdownMenuRadioItem key={option} value={option}>
                            {option}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Panel>
  );
};
