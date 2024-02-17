import { useState, useEffect, useRef } from "react";
import useHoverModal from "../Hooks/useHoverModal";
import useAutoScrollModal from "../Hooks/useAutoScrollModal";
import ModalOverlay from "./modalOverlay";

interface SearchResultModalProps {
  searchResults: any[];
  isOpen: boolean;
  onClose: () => void;
  onWordSelect: (word: string, append: boolean) => void;
  position?: { x: number; y: number };
  editorPosition: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  animate?: boolean;
  result?: string
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
  const [hoveredResult, setHoveredResult] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useAutoScrollModal(modalRef, animate);
  const {
    selectionModalOpen,
    setSelectionModalOpen,
    selectionModalPosition,
    selectedWord,
    handleWordHover,
    setSelectedResult
  } = useHoverModal();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isOpen) {
      setRender(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => setRender(false), 300);
    }
    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  const handleClose = () => {
    setSelectionModalOpen(false);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setHoveredResult(null);
    }
  }, [isOpen]);

  const handleMouseEnter = (result: string) => {
    setHoveredResult(result);
  };

  if (!render) return null;

  const { width, left } = editorPosition;

  const modalContentStyle: React.CSSProperties = {
    position: 'absolute',
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
    zIndex: 10,
  };

  const selectionModalStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${selectionModalPosition.y}px`,
    left: `${selectionModalPosition.x}px`,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    padding: '10px',
    borderRadius: '4px',
    zIndex: 20,
  };

  return (
      <>
        <ModalOverlay isOpen={isOpen} onClose={handleClose} animate={animate} />
          <div
            ref={modalRef}
            className="modal-content"
            style={modalContentStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <ul>
              {searchResults.map((result, index) => (
                <li
                  key={index}
                  onMouseOver={(e) => handleWordHover(e, result)}
                  onMouseEnter={() => handleMouseEnter(result)}
                  onClick={() => {
                    setSelectedResult(result);
                    onWordSelect(selectedWord, false);
                  }}
                  style={{
                    backgroundColor: hoveredResult === result ? '#e0f2fe' : 'transparent',
                    cursor: 'pointer',
                    padding: '5px 10px',
                    borderRadius: '4px'
                  }}
                >
                  {result}
                </li>
              ))}
            </ul>
         </div>
        {selectionModalOpen && (
          <div style={selectionModalStyle}>
            <button className="hover:bg-indigo-100 rounded p-1 text-teal-700 font-medium" onClick={() => onWordSelect(selectedWord, true)}>右に配置</button>
            <button className="hover:bg-indigo-100 rounded p-1 text-pink-700 font-medium" onClick={() => onWordSelect(selectedWord, false)}>置き換え</button>
          </div>
        )}
    </>
  );
};

export default SearchResultModal;