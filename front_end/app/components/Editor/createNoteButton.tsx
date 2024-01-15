import React from 'react';
import axios from 'axios';
import { ContentState, convertToRaw } from 'draft-js';

interface CreateNoteButtonProps {
  onNoteCreated: (noteId: number | null) => void;
}

const CreateNoteButton: React.FC<CreateNoteButtonProps> = ({ onNoteCreated }) => {
  const createNote = async () => {
    const defaultContentState = ContentState.createFromText("Default Content");
    const rawJson = convertToRaw(defaultContentState);

    try {
      const response = await axios.post('http://localhost:3003/api/v1/notes', {
        note: {
          title: "Default Title",
          body: JSON.stringify(rawJson)
        }
      });

      const noteId = parseInt(response.data.id, 10); // string から number に変換
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
