import { useState, useEffect } from 'react';

const useSelectionPosition = () => {
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
            y: rect.bottom
          });
        }
      }
    };

    document.addEventListener('mouseup', updatePosition);

    return () => {
      document.removeEventListener('mouseup', updatePosition);
    };
  }, []);

  return position;
};

export default useSelectionPosition;
