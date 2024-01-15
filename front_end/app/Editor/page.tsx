"use client"
import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../components/Editor/sidebar";
import Synchronize from '../components/Editor/synchronize';
import NoteActions, { handleNoteCreated, handleSelectNote, handleDeleteNote } from '../components/Editor/noteAction';
import { EditorState } from 'draft-js';
import AutoSaveComponent from '../components/Editor/autoSave';
import Editor from '@draft-js-plugins/editor';
import InlineToolbarComponent from '../components/Editor/inlineToolbar';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import createLinkPlugin from '@draft-js-plugins/anchor';
import createLinkifyPlugin from '@draft-js-plugins/linkify';
import blockStyleFn from "../components/Editor/blockStyleClasses";
import '@draft-js-plugins/anchor/lib/plugin.css';

export interface Note {
  id: number;
  title: string;
  body: Text;
}

interface MyEditorProps {}

const MyEditor: React.FC<MyEditorProps> = () => {
  const [plugins, InlineToolbar, LinkButton] = useMemo(() => {
    const linkPlugin = createLinkPlugin({ placeholder: 'https://...' });
    const linkifyPlugin = createLinkifyPlugin();
    const inlineToolbarPlugin = createInlineToolbarPlugin();
    return [
      [inlineToolbarPlugin, linkPlugin, linkifyPlugin],
      inlineToolbarPlugin.InlineToolbar,
      linkPlugin.LinkButton,
    ];
  }, []);

  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteId, setNoteId] = useState<number | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>("");

  const onNewNoteCreated = async (newNoteId: number | null) => {
    if (newNoteId !== null) {
      await handleNoteCreated(newNoteId, setNotes, notes);
    }
  };

  const onDeleteNote = async (noteIdToDelete: number) => {
    await handleDeleteNote(noteIdToDelete, setNotes, notes);
  };

  const onSelectNote = async (selectedNoteId: number) => {
    await handleSelectNote(selectedNoteId, setNoteId, setNoteTitle, setEditorState);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:3003/api/v1/notes');
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, []);

  const onChange = (value: EditorState) => {
    setEditorState(value);
  };

  return (
    <div className="flex">
      <Sidebar
        notes={notes}
        onSelectNote={onSelectNote}
        onDeleteNote={onDeleteNote}
        onNoteCreated={onNewNoteCreated}
      />

      <div className="flex-1">
        <Synchronize
          noteId={noteId}
          noteTitle={noteTitle}
          setNoteTitle={setNoteTitle}
          setNotes={setNotes}
          notes={notes}
        />

        <Editor
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
          blockStyleFn={blockStyleFn}
        />
        <InlineToolbarComponent
          editorState={editorState}
          setEditorState={setEditorState}
          InlineToolbar={InlineToolbar}
          LinkButton={LinkButton}
        />
      </div>

      <NoteActions
        notes={notes}
        setNotes={setNotes}
        noteId={noteId}
        setNoteId={setNoteId}
        setNoteTitle={setNoteTitle}
        setEditorState={setEditorState}
      />
      <AutoSaveComponent
        editorState={editorState}
        noteId={noteId}
        noteTitle={noteTitle}
      />
    </div>
  );
};

export default MyEditor;
