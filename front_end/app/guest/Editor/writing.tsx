interface WritingButtonProps {
  onToggle: () => void;
}
const WritingButton: React.FC<WritingButtonProps> = ({ onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="hover:bg-gray-100 text-gray-500 font-semibold py-2 px-4 rounded"
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '10px 15px',
        border: 'none',
        cursor: 'pointer',
      }}
    >
     早速Lyricを書く
    </button>
  );
};

export default WritingButton;
