import { useState, useEffect } from "react";
import ModalOverlay from "./modalOverlay";

interface SearchResultModalProps {
  searchResults: any[];
  isOpen: boolean;
  onClose: () => void;
  onWordSelect: (word: string) => void;
  position?: { x: number; y: number };
  editorPosition: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  animate?: boolean;
}

const SearchResultModal: React.FC<SearchResultModalProps> = ({
  searchResults,
  isOpen,
  onClose,
  onWordSelect,
  position,
  editorPosition,
}) => {
  const [render, setRender] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [selectionModalOpen, setSelectionModalOpen] = useState(false);
  const [selectionModalPosition, setSelectionModalPosition] = useState({ x: 0, y: 0 });
  const [selectedWord, setSelectedWord] = useState("");

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => setRender(false), 300);
    }
  }, [isOpen]);

  const handleWordHover = (event: React.MouseEvent<HTMLElement>, word: string) => {
    const subModal = document.getElementById("subModal");
    const subModalWidth = subModal?.offsetWidth || 200;

    const hoverRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const offsetX = 100;
    // サブモーダルをリストアイテムの左側に配置するためのX座標を計算
    const modalPositionX = hoverRect.left - subModalWidth - offsetX;

    setSelectionModalPosition({
      x: modalPositionX + window.scrollX,
      y: hoverRect.bottom + window.scrollY,
    });
    setSelectedWord(word);
    setSelectionModalOpen(true);
  };

  const handleClose = () => {
    setSelectionModalOpen(false);
    onClose();
  };

  if (!render) return null;

  const { width, left } = editorPosition;

  const modalContentStyle: React.CSSProperties = {
    position: 'fixed', // Updated to fixed to position relative to viewport
    top:  position ? `${position.y}px` : '50%',
    left: `${left}px`,
    width: `${width}px`,
    transform: position ? 'none' : 'translate(-50%, -50%)', // Adjusted for custom position
    opacity: animate ? 1 : 0,
    transition: 'opacity 0.3s ease-out',
    backgroundColor: '#fafaf9',
    padding: '20px',
    borderRadius: '4px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    maxHeight: '50vh',
    overflowY: 'auto',
    zIndex: 1050,
  };

  const selectionModalStyle = {
    position: 'fixed',
    top: `${selectionModalPosition.y}px`,
    left: `${selectionModalPosition.x}px`,
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    padding: '10px',
    borderRadius: '4px',
    zIndex: 1060, // Ensure it's above the rhyme search modal
  };

  return (
      <>
        <ModalOverlay isOpen={isOpen} onClose={handleClose} animate={animate} />
          <div
            className="modal-content"
            style={modalContentStyle}
            onClick={(e) => e.stopPropagation()}
          >
        <ul>
          {searchResults.map((result, index) => (
            <li
              key={index}
              onClick={() => onWordSelect(result)}
              className="hover:bg-indigo-100 cursor-pointer"
            >
              {result}
            </li>
          ))}
        </ul>
      </div>
      </>
    );
};

export default SearchResultModal;