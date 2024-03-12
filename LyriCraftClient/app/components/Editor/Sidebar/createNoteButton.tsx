import React from 'react';
import axiosInstance from '../editor/axiosConfig';
import { ContentState, convertToRaw } from 'draft-js';
import { NoteData } from '@/types/types';

interface CreateNoteButtonProps {
  onNoteCreated: (newNote: NoteData | null) => void;
}

const CreateNoteButton: React.FC<CreateNoteButtonProps> = ({ onNoteCreated }) => {
  const createNote = async () => {
    const emptyContentState = ContentState.createFromText("");
    const rawJson = convertToRaw(emptyContentState);

    try {
      const response = await axiosInstance.post('/user/notes', {
        note: {
          title: "",
          body: JSON.stringify(rawJson)
        }
      });

      if (response.data && response.data.data) {
        const newNote = {
          id: parseInt(response.data.data.id, 10),
          title: response.data.data.attributes.title,
          body: response.data.data.attributes.body,
          createdAt: response.data.data.attributes.createdAt
        };
        onNoteCreated(newNote);
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
      className="text-xl rounded-full bg-indigo-500 hover:bg-indigo-400 text-white px-2 py-0.25 mr-1 mt-14"
      onClick={createNote}>
        +
    </button>
  );
};

export default CreateNoteButton;
