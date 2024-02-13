import { useState } from 'react';

const useHoverModal = () => {
  const [selectionModalOpen, setSelectionModalOpen] = useState(false);
  const [selectionModalPosition, setSelectionModalPosition] = useState({ x: 0, y: 0 });
  const [selectedWord, setSelectedWord] = useState("");

  const handleWordHover = (event: React.MouseEvent<HTMLElement>, word: string) => {
    const hoverRect = event.currentTarget.getBoundingClientRect();
    const modalPositionX = hoverRect.left -70;

    setSelectionModalPosition({
      x: modalPositionX,
      y: hoverRect.top 
    });
    setSelectedWord(word);
    setSelectionModalOpen(true);
  };

  return { selectionModalOpen, setSelectionModalOpen, selectionModalPosition, selectedWord, handleWordHover };
};

export default useHoverModal;
