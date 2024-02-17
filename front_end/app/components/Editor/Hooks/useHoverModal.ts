import { useState } from 'react';

const useHoverModal = () => {
  const [selectionModalOpen, setSelectionModalOpen] = useState(false);
  const [selectionModalPosition, setSelectionModalPosition] = useState({ x: 0, y: 0 });
  const [selectedWord, setSelectedWord] = useState("");
  const [selectedResult, setSelectedResult] = useState<string | null>(null);

  const handleWordHover = (event: React.MouseEvent<HTMLElement>, word: string) => {
    if (!selectionModalOpen || (selectionModalOpen && selectedWord !== word)) {
      const hoverRect = event.currentTarget.getBoundingClientRect();
      const isMobileSize = window.innerWidth <= 640;
      const modalPositionX = isMobileSize ? hoverRect.right - 50 : hoverRect.left - 100;
      const modalPositionY = hoverRect.top - 10;

      setSelectionModalPosition({
        x: modalPositionX,
        y: modalPositionY + window.scrollY
      });

      if (!selectionModalOpen || selectedWord !== word) {
        setSelectedWord(word);
      }
      setSelectionModalOpen(true);
    }
  };

  return {
    selectionModalOpen,
    setSelectionModalOpen,
    selectionModalPosition,
    selectedWord,
    handleWordHover,
    setSelectedResult,
    selectedResult,
  };
};

export default useHoverModal;
