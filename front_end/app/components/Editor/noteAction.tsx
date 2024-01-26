import React from 'react';
import axiosInstance from './axiosConfig';
import { EditorState, convertFromRaw } from 'draft-js';

interface Note {
  id: number;
  title: string;
  body: Text;
}

interface NoteActionsProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  noteId: number | null;
  setNoteId: React.Dispatch<React.SetStateAction<number | null>>;
  setNoteTitle: React.Dispatch<React.SetStateAction<string>>;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

// ノート作成関数
export const handleNoteCreated = async (newNoteId: number, setNotes: React.Dispatch<React.SetStateAction<Note[]>>, notes: Note[]) => {
  try {
    const response = await axiosInstance.get(`/user/notes/${newNoteId}`);
    const newNote = response.data.data.attributes; // この行を修正
    setNotes([...notes, { id: parseInt(response.data.data.id, 10), ...newNote }]);
  } catch (error) {
    console.error('Error fetching note:', error);
  }
};

// ノート選択関数
export const handleSelectNote = async (selectedNoteId: number, setNoteId: React.Dispatch<React.SetStateAction<number | null>>,
                                                               setNoteTitle: React.Dispatch<React.SetStateAction<string>>,
                                                               setEditorState: React.Dispatch<React.SetStateAction<EditorState>>) => {
    setNoteId(selectedNoteId);
    try {
      const response = await axiosInstance.get(`/user/notes/${selectedNoteId}`);
      const note = response.data.data.attributes;
      setNoteTitle(note.title);
      const contentState = convertFromRaw(JSON.parse(note.body));
      setEditorState(EditorState.createWithContent(contentState));
    } catch (error) {
      console.error('Error fetching note:', error);
    }
  };

// ノート削除関数
export const handleDeleteNote = async (noteId: number, setNotes: React.Dispatch<React.SetStateAction<Note[]>>, notes: Note[]) => {
  try {
    await axiosInstance.delete(`/user/notes/${noteId}`);
    setNotes(notes.filter(note => note.id !== noteId));
  } catch (error) {
    console.error('Error deleting note:', error);
  }
};

const NoteActions: React.FC<NoteActionsProps> = ({
  notes, setNotes, noteId, setNoteId, setNoteTitle, setEditorState
}) => {
  // このコンポーネントは主に関数をエクスポートするために使用されます。
  // そのため、ここではUIをレンダリングしません。
  return null;
};

export default NoteActions;