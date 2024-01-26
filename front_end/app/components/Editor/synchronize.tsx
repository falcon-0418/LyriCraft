import React from 'react';
import axiosInstance from './axiosConfig';
import { Note } from '../../editor/page';

interface SynchronizeProps {
  noteId: number | null;
  noteTitle: string;
  setNoteTitle: React.Dispatch<React.SetStateAction<string>>;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  notes: Note[];
}

const Synchronize: React.FC<SynchronizeProps> = ({ noteId, noteTitle, setNoteTitle, setNotes, notes }) => {
  const updateNoteTitle = async (title: string, noteId: number) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId ? { ...note, title: title } : note
    );
    setNotes(updatedNotes);

    try {
      const response = await axiosInstance.put(`/user/notes/${noteId}`, {
        title: title,
      });
      console.log('Note title updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating note title:', error);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (noteId !== null) {
      setNoteTitle(e.target.value);
      updateNoteTitle(e.target.value, noteId);
    }
  };

  return (
    <input
      type="text"
      value={noteTitle}
      onChange={handleTitleChange}
      placeholder="タイトルを入力"
      className="border-none text-5xl font-bold focus:ring-0 p-2"
    />
  );
};

export default Synchronize;
