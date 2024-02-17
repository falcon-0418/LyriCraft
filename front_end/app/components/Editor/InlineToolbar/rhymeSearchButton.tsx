import React from 'react';
import axiosInstance from '../editor/axiosConfig';

interface RhymeResult {
  word: string;
}

  interface RhymeSearchButtonProps {
    selectedText: string;
    setSearchResults: React.Dispatch<React.SetStateAction<RhymeResult[]>>;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }

  const RhymeSearchButton: React.FC<RhymeSearchButtonProps> = ({
    selectedText,
    setSearchResults,
    setIsModalOpen
  }) => {
  const handleRhymeSearch = async () => {
    if (!selectedText) {
        return;
      }

    try {
      const response = await axiosInstance.get(`/rhyme_search?word=${(selectedText)}`);
      setSearchResults(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching rhymes:', error);
    }
  };

  const onMouseDown = (event: React.MouseEvent) => event.preventDefault();

  return (
    <button
    onMouseDown={onMouseDown}
    onClick={handleRhymeSearch}
    className="your-button-styles font-light p-2 text-fuchsia-500 pointer-events-auto hover:bg-neutral-100"
    >
      韻検索
    </button>
  );
};

export default RhymeSearchButton;