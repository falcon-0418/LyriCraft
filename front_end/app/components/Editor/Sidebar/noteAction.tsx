import React from 'react';
import axiosInstance from '../editor/axiosConfig';
import { EditorState, convertFromRaw } from 'draft-js';
import { NoteData } from '@/types/types';

interface NoteActionsProps {
  notes: NoteData[];
  setNotes: React.Dispatch<React.SetStateAction<NoteData[]>>;
  noteId: number | null;
  setNoteId: React.Dispatch<React.SetStateAction<number | null>>;
  setNoteTitle: React.Dispatch<React.SetStateAction<string>>;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

// ノート作成関数
export const handleNoteCreated = async (newNoteId: number, setNotes: React.Dispatch<React.SetStateAction<NoteData[]>>, notes: NoteData[]) => {
  try {
    const response = await axiosInstance.get(`/user/notes/${newNoteId}`);
    const newNote: NoteData = {
      id: parseInt(response.data.data.id, 10),
      title: response.data.data.attributes.title,
      body: response.data.data.attributes.body,
    };
    console.log('setNotes called from handleNoteCreated');
    setNotes([newNote, ...notes]);
  } catch (error) {
    console.error('Error fetching note:', error);
  }
};

// ノート選択関数
export const handleSelectNote = async (
  selectedNoteId: number,
  setNoteId: React.Dispatch<React.SetStateAction<number | null>>,
  setNoteTitle: React.Dispatch<React.SetStateAction<string>>,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>,
  editorRef: React.RefObject<HTMLDivElement>
  ) => {
    setNoteId(selectedNoteId);
    try {
      const response = await axiosInstance.get(`/user/notes/${selectedNoteId}`);
      const note = response.data.data.attributes;
      setNoteTitle(note.title);
      const contentState = convertFromRaw(JSON.parse(note.body));
      const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);

      // エディタにフォーカスを当てる
      if (editorRef.current) {
          editorRef.current?.focus();
      }
    } catch (error) {
      console.error('Error fetching note:', error);
    }
  };

// ノート削除関数
export const handleDeleteNote = async (
  noteId: number,
  setNotes: React.Dispatch<React.SetStateAction<NoteData[]>>,
  notes: NoteData[]
) => {
  try {
    await axiosInstance.delete(`/user/notes/${noteId}`);
    console.log('setNotes called from handleDeleteNote');
    setNotes(notes.filter(note => note.id !== noteId));
  } catch (error) {
    console.error('Error deleting note:', error);
  }
};

const NoteActions: React.FC<NoteActionsProps> = ({
  notes, setNotes, noteId, setNoteId, setNoteTitle, setEditorState,
}) => {
  // このコンポーネントは主に関数をエクスポートするために使用されます。
  // そのため、ここではUIをレンダリングしません。
  return null;
};

export default NoteActions;