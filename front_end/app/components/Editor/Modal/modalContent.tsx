import React, { useRef } from 'react';

interface ModalContentProps {
  searchResults: any[];
  isOpen: boolean;
  onClose: () => void;
  onWordSelect: (word: string) => void;
  position?: { x: number; y: number };
  editorPosition: {
    left: number;
    top: number;
    height: number;
  };
  animate?: boolean;
}

const ModalContent: React.FC<ModalContentProps & { animate: boolean; }> = ({
    searchResults,
    isOpen,
    onWordSelect,
    position,
    animate,

  }) => {

    if (!isOpen) return null;

    const modalContentStyle: React.CSSProperties = {
      position: 'fixed',
      top: position ? `${position.y}px` : '50%',
      left: position ? `${position.x}px` : '50%',
      transform: position ? 'none' : 'translate(-50%, -50%)', 
      opacity: animate ? 1 : 0,
      transition: 'opacity 0.3s ease-out',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '4px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      zIndex: 1050,
    };

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    return (
      <div
        className="modal-content"
        style={modalContentStyle}
        onClick={handleClick}
      >
        <ul>
          {searchResults.map((result, index) => (
            <li
              key={index}
              onClick={() => onWordSelect(result)}
              className="hover:bg-gray-200 cursor-pointer"
            >
              {result}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  export default ModalContent