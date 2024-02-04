import { useState, useEffect } from "react";

interface RhymeSearchModalProps {
  searchResults: any[];
  isOpen: boolean;
  onClose: () => void;
  onWordSelect: (word: string) => void;
  position?: { x: number; y: number };
}

const RhymeSearchModal: React.FC<RhymeSearchModalProps> = ({
  searchResults,
  isOpen,
  onClose,
  onWordSelect,
  position
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

  const modalClassName = `fixed inset-0 transition-opacity duration-300 ${animate ? 'opacity-100' : 'opacity-0'}`;

  const modalContentStyle = {
    position: 'absolute',
    top: position ? `${position.y}px` : '50%',
    left: position ?`${position.x}px` : '50%',
    transform: animate ? 'translate(-50%) scale(1)' : 'translate(-50%) scale(0.8)',
    opacity: animate ? 1 : 0,
    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '4px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    maxHeight: '50vh',

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
    <div className={modalClassName} onClick={handleClose}>
      <div
        className="modal-content"
        style={modalContentStyle as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        <ul>
          {searchResults.map((result, index) => (
            <li
              key={index}
              onClick={() => onWordSelect(result)}
              className="hover:bg-gray-200 cursor-pointer"
            >
             <span onMouseEnter={(e) => handleWordHover(e, result)}>{result}</span>
            </li>
          ))}
        </ul>
        {selectionModalOpen && (
          <div style={selectionModalStyle as React.CSSProperties}>
            <ul>
              <li className="cursor-pointer hover:bg-gray-100" onClick={() => onWordSelect(selectedWord + " ")}>右に配置</li>
              <li className="cursor-pointer hover:bg-gray-100" onClick={() => onWordSelect(selectedWord)}>置換する</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RhymeSearchModal;