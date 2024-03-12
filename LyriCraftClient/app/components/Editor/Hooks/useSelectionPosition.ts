import { useState, useEffect } from 'react';

const useSelectionPosition = (isModalOpen: boolean) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const parentElement = range.commonAncestorContainer.parentElement;

        if (parentElement && !parentElement.closest('.modal-content')) {
          setPosition({
            x: rect.left,
            y: rect.bottom + window.scrollY
          });
        }
      }
    };

    document.addEventListener('mouseup', updatePosition);
    document.addEventListener('keyup', updatePosition);

    return () => {
      document.removeEventListener('mouseup', updatePosition);
      document.removeEventListener('keyup', updatePosition);
    };
  }, [isModalOpen]);

  return position;
};

export default useSelectionPosition;
