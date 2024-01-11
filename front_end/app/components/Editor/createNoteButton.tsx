import React from 'react';
import { ContentState, convertToRaw } from 'draft-js';

interface CreateNoteButtonProps {
  onNoteCreated: (noteId: number | null) => void;
}

const CreateNoteButton: React.FC<CreateNoteButtonProps> = ({ onNoteCreated }) => {
  const createNote = async () => {
    const defaultContentState = ContentState.createFromText("Default Content");
    const rawJson = convertToRaw(defaultContentState);

    try {
      const response = await fetch('http://localhost:3003/api/v1/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: {
            title: "Default Title",
            body: JSON.stringify(rawJson)
          }
        })
      });

      if (!response.ok) {
        throw new Error('Error creating note');
      }

      const data = await response.json();
      const noteId = parseInt(data.id, 10); // string から number に変換
      if (!isNaN(noteId)) {
        onNoteCreated(noteId);
      } else {
        onNoteCreated(null);
      }
    } catch (error) {
      console.error('Error:', error);
      onNoteCreated(null);
    }
  };

  return (
    <button
      className="text-xl rounded-full bg-indigo-500 text-white px-5 py-1.5 mr-5 my-7"
      onClick={createNote}>
        +
    </button>
  );
};

export default CreateNoteButton;
