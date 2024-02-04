import React from 'react';
import axiosInstance from './axiosConfig';

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
    console.log("RhymeSearchButton: selectedText received:", selectedText);
  const handleRhymeSearch = async () => {
    console.log("RhymeSearchButton clicked with text:", selectedText);
    if (!selectedText) {
        return;
      }

    try {
      const response = await axiosInstance.get(`/rhyme_search?word=${(selectedText)}`);
      console.log("API Response:", response.data);
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
    className="your-button-styles font-bold text-gray-500 pointer-events-auto hover:bg-gray-300"
    >
      韻検索
    </button>
  );
};

export default RhymeSearchButton;