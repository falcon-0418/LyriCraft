import { useState, useEffect } from "react";
import useHoverModal from "../Hooks/useHoverModal";
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
  const { selectionModalOpen, setSelectionModalOpen, selectionModalPosition, selectedWord, handleWordHover } = useHoverModal();

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => setRender(false), 300);
    }
  }, [isOpen]);

  const handleClose = () => {
    setSelectionModalOpen(false);
    onClose();
  };

  if (!render) return null;

  const { width, left } = editorPosition;

  const modalContentStyle: React.CSSProperties = {
    position: 'fixed',
    top:  position ? `${position.y}px` : '50%',
    left: `${left}px`,
    width: `${width}px`,
    transform: position ? 'none' : 'translate(-50%, -50%)',
    opacity: animate ? 1 : 0,
    transition: 'opacity 0.3s ease-out',
    backgroundColor: '#fafaf9',
    padding: '20px',
    borderRadius: '4px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    maxHeight: '40vh',
    overflowY: 'auto',
    zIndex: 1050,
  };

  const selectionModalStyle: React.CSSProperties = {
    position: 'fixed',
    top: `${selectionModalPosition.y}px`,
    left: `${selectionModalPosition.x}px`,
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    padding: '10px',
    borderRadius: '4px',
    zIndex: 1060,
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
              onMouseOver={(e) => handleWordHover(e, result)}
              onClick={() => onWordSelect(result)}
              className="hover:bg-indigo-100 cursor-pointer"
            >
              {result}
            </li>
          ))}
        </ul>
      </div>
      {selectionModalOpen && (
    <div style={selectionModalStyle}>
      <p>{selectedWord}</p>
    </div>
  )}
      </>
    );
};

export default SearchResultModal;