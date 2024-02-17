import React, { useEffect } from 'react';

const ModalOverlay: React.FC<{ isOpen: boolean; onClose: () => void; animate: boolean }> = ({
  isOpen,
  onClose,
  animate,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }
    return () => {
      document.body.style.userSelect = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const className = `fixed inset-0 z-5 transition-opacity duration-300 ${animate ? 'opacity-100' : 'opacity-0'}`;
  return <div className={className} onClick={onClose} />;
};

export default ModalOverlay