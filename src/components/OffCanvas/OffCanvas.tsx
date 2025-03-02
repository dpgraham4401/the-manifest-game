import { Help } from '@/components/Help/Help';
import React, { useCallback, useEffect, useRef } from 'react';
import { FaX } from 'react-icons/fa6';

interface OffCanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sidebar for displaying content and help
 * @constructor
 */
export const OffCanvas = ({ isOpen, onClose }: OffCanvasProps) => {
  /** handle when user clicks outside the off canvas component*/
  const contentRef = useRef<HTMLDivElement | null>(null);

  const onClickOutside = useCallback(() => {
    if (isOpen) {
      if (onClose) onClose();
    }
  }, [isOpen, onClose]);

  /** handle when user presses the escape key */
  const onEscKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        if (onClose) onClose();
      }
    },
    [isOpen, onClose]
  );

  /** add event listeners for escape key keydown*/
  useEffect(() => {
    document.addEventListener('keydown', onEscKey, false);
    return () => document.removeEventListener('keydown', onEscKey);
  }, [onEscKey]);

  /** add event listeners for click outside */
  useEffect(() => {
    document.addEventListener('click', onClickOutside, false);
    return () => document.removeEventListener('click', onClickOutside);
  }, [onClickOutside]);

  useEffect(() => {
    if (isOpen) {
      contentRef.current?.focus();
    }
  }, [contentRef, isOpen]);

  return (
    <>
      <div
        data-testid="offcanvas"
        id={'offcanvas'}
        className={`fixed bottom-0 right-0 top-20 z-1050 flex w-3/4 translate-x-full flex-col rounded-2xl bg-white outline-hidden transition-all ease-in-out sm:w-10/12 md:w-6/12 lg:w-5/12 ${isOpen ? 'mb-2 mr-2 ms-0 mt-0 transform-none' : ''} pb-10`}
        tabIndex={-1}
        role="dialog"
        aria-label="Off Canvas"
        aria-modal="true"
        aria-hidden={!isOpen}
        hidden={!isOpen}
      >
        <div className="flex justify-end p-3">
          <button
            className="rounded-full p-1 text-gray-800 transition-colors duration-200 ease-in-out hover:text-gray-900 focus:outline-hidden focus:ring-3 focus:ring-gray-800 active:text-gray-900"
            onClick={onClose}
            type="button"
            tabIndex={0}
            aria-label="Close"
          >
            <FaX size={20} />
          </button>
        </div>
        <div className="max-h-full overflow-x-hidden overflow-y-scroll px-6" ref={contentRef}>
          <Help />
        </div>
      </div>
      {/* backdrop while open*/}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-200 ease-in-out ${isOpen ? 'visible opacity-60' : 'invisible opacity-0'}`}
      />
    </>
  );
};
