import React from 'react';
import { useRouter } from 'next/navigation';

const WritingAiButton = () => {
  const router = useRouter();

  const handleNavigate = () => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      router.push('components/Editor/editor');
    } else {
      router.push('/login');
    }
  };

  return (
    <button
      className="hover:bg-gray-100 text-gray-500 font-semibold py-2 px-4 rounded"
      onClick={handleNavigate}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '10px 15px',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      MyNoteにLyricを書く
    </button>
  );
};

export default WritingAiButton;
