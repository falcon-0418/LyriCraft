interface SelectionPositionProps {
  position?: { x: number; y: number };
  onClose: () => void;
  children: React.ReactNode;
}

const SelectionModal: React.FC<SelectionPositionProps> = ({ position, onClose, children }) => {
  const style = {
    position: 'fixed',
    top: position ? `${position.y}px` : '50%',
    left: position ?`${position.x}px` : '50%',
  };

  return (
    <div style={style as React.CSSProperties} onClick={onClose}>
      {children}
    </div>
  );
};

export default SelectionModal;