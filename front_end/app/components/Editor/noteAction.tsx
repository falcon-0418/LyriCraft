import React from 'react';
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
    const response = await fetch(`http://localhost:3003/api/v1/notes/${newNoteId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch the note');
    }
    const newNote = await response.json();
    setNotes([...notes, newNote]);
  } catch (error) {
    console.error('Error fetching note:', error);
  }
};

// ノート選択関数
export const handleSelectNote = async (selectedNoteId: number, setNoteId: React.Dispatch<React.SetStateAction<number | null>>, setNoteTitle: React.Dispatch<React.SetStateAction<string>>, setEditorState: React.Dispatch<React.SetStateAction<EditorState>>) => {
  setNoteId(selectedNoteId);
  try {
    const response = await fetch(`http://localhost:3003/api/v1/notes/${selectedNoteId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch the note');
    }
    const note = await response.json();
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
    const response = await fetch(`http://localhost:3003/api/v1/notes/${noteId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete the note');
    }
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
