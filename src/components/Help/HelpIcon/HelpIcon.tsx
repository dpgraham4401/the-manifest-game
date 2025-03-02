import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

interface HelpIconProps {
  onClick?: React.MouseEventHandler;
  size?: number;
}

/**
 * icon to help users make decisions or direct them to more information
 * @constructor
 */
export const HelpIcon = ({ onClick, size = 30 }: HelpIconProps) => {
  return (
    <div>
      <button
        aria-label="more information"
        onClick={onClick}
        className="rounded-full border-2 border-transparent bg-transparent focus:outline-hidden focus:ring-3 focus:ring-white"
      >
        <FaQuestionCircle
          size={size}
          className="rounded-full text-slate-50 transition-all duration-200 ease-in-out hover:text-slate-400"
        />
      </button>
    </div>
  );
};
