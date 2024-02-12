import { useState } from 'react';

const useHoverPosition = () => {
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const HoverPosition = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY
    });
  };

  return { hoverPosition, setHoverPosition };
};

export default useHoverPosition;