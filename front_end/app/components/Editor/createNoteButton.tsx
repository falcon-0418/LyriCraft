import React from 'react';
import axiosInstance from './axiosConfig';
import { ContentState, convertToRaw } from 'draft-js';

interface CreateNoteButtonProps {
  onNoteCreated: (noteId: number | null) => void;
}

const CreateNoteButton: React.FC<CreateNoteButtonProps> = ({ onNoteCreated }) => {
  const createNote = async () => {
    const defaultContentState = ContentState.createFromText("Default Content");
    const rawJson = convertToRaw(defaultContentState);

    try {
      const response = await axiosInstance.post('/user/notes', {
        note: {
          title: "Default Title",
          body: JSON.stringify(rawJson)
        }
      });

      const noteId = response.data && response.data.data ? parseInt(response.data.data.id, 10) : null;
      if (noteId) {
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
