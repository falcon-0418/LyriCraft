"use client"
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { replaceText } from '../components/Editor/textUtils';
import axiosInstance from '../components/Editor/axiosConfig';
import Sidebar from "../components/Editor/sidebar";
import { Title } from '../components/Editor/title';
import { NoteData } from '@/types/types';
import { RiMenuFoldFill, RiMenuUnfoldFill } from "react-icons/ri";
import NoteActions,{ handleNoteCreated, handleSelectNote, handleDeleteNote } from '../components/Editor/noteAction';
import { EditorState, convertFromRaw } from 'draft-js';
import { titleKeyActions } from '../components/Editor/titleKeyAction';
import { editorKeyActions } from '../components/Editor/editorKeyAction';
import AutoSaveComponent from '../components/Editor/autoSave';
import Editor from '@draft-js-plugins/editor';
import InlineToolbarComponent from '../components/Editor/inlineToolbar';
import RhymeSearchModal from '../components/Editor/searchResultModal';
import useSelectedText from '../hooks/useSelectedText'
import useSelectionPosition from '../hooks/useSelectionPosition';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import createLinkPlugin from '@draft-js-plugins/anchor';
import createLinkifyPlugin from '@draft-js-plugins/linkify';
import blockStyleFn from "../components/Editor/blockStyleClasses";
import '@draft-js-plugins/anchor/lib/plugin.css';

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
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [noteId, setNoteId] = useState<number | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const selectedText = useSelectedText(editorState);
  const selectionPosition = useSelectionPosition();

  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    console.log("Current selection position:", selectionPosition);
  }, [selectionPosition]);


  const onNewNoteCreated = async (newNote: NoteData | null) => {
    if (newNote !== null) {
      await handleNoteCreated(newNote.id, setNotes, notes);
      setNoteId(newNote.id);
      setNoteTitle(newNote.title);
      setEditorState(EditorState.createEmpty());
    }
  };

  const onDeleteNote = async (noteIdToDelete: number) => {
    await handleDeleteNote(noteIdToDelete, setNotes, notes);
    const updatedNotes = notes.filter(note => note.id !== noteIdToDelete);
    if (updatedNotes.length > 0) {
      const firstNote = updatedNotes[0];
      onSelectNote(firstNote.id);
    } else {
      setEditorState(EditorState.createEmpty());
      setNoteId(null);
      setNoteTitle("");
    }
  };

  const onSelectNote = async (selectedNoteId: number) => {
    await handleSelectNote(selectedNoteId, setNoteId, setNoteTitle, setEditorState);

  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axiosInstance.get('/user/notes');
        let fetchedNotes = response.data.data.map((noteItem: any) => ({
          id: parseInt(noteItem.id, 10),
          title: noteItem.attributes.title,
          body: noteItem.attributes.body,
          createdAt: noteItem.attributes.created_at,
        }));

        fetchedNotes.sort((a: NoteData, b: NoteData) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setNotes(fetchedNotes);
        if (fetchedNotes.length > 0) {
          const firstNote = fetchedNotes[0];
          setNoteId(firstNote.id);
          setNoteTitle(firstNote.title);
          setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(firstNote.body))));
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    fetchNotes();
  }, []);

  const titleActions = titleKeyActions({
    textareaRef,
    onEnter: () => {
      if (editorRef.current) {
        editorRef.current.focus();
        const newState = EditorState.moveFocusToEnd(editorState);
        setEditorState(newState);
      }
    }
  });

  const handleKeyDown = titleActions.handleKeyDown;

  const editorActions = editorKeyActions({ editorState, setEditorState, textareaRef });
  const handleKeyCommand = editorActions.handleKeyCommand;
  const keyBindingFn = editorActions.keyBindingFn;

  const savedSidebarWidth = localStorage.getItem('sidebarWidth');
  const initialSidebarWidth = savedSidebarWidth ? parseInt(savedSidebarWidth, 10) : 250;

  const [sidebarWidth, setSidebarWidth] = useState(initialSidebarWidth);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setSidebarWidth(isSidebarOpen ? 0 : 250);
  };

  

  const handleWordSelect = (word: string) => {
    const newEditorState = replaceText(editorState, word);
    setEditorState(newEditorState);
    setIsModalOpen(false); // モーダルを閉じる
  };


  const onChange = (value: EditorState) => {
    setEditorState(value);
  };

  return (
    <div className="flex min-h-screen">
      <div className="fixed top-0 left-0 bottom-0"style={{
        width: isSidebarOpen ? sidebarWidth : 0,
        transition: 'width 0.3s ease'
      }}>
        <Sidebar
          notes={notes}
          onSelectNote={onSelectNote}
          onDeleteNote={onDeleteNote}
          onNoteCreated={onNewNoteCreated}
          setSidebarWidth={setSidebarWidth}
          isSidebarOpen={isSidebarOpen}
          sidebarWidth={sidebarWidth}
        />
      </div>
      <button onClick={toggleSidebar} style={{
        position: 'fixed',
        top: 0,
        left: isSidebarOpen ? sidebarWidth : 0,
        transition: 'left 0.3s ease'
      }}>
        {
          isSidebarOpen
            ? <RiMenuFoldFill style={{ fontSize: '30px', margin: '5px'}}/>
            : <RiMenuUnfoldFill style={{ fontSize: '30px', margin: '5px' }}/>
        }
      </button>
        <div
          className="flex flex-col items-center justify-start" style={{
            marginLeft: isSidebarOpen ? sidebarWidth : 0,
            width: isSidebarOpen ? `calc(100% - ${sidebarWidth}px)` : '100%',
            transition: 'margin-left 0.3s ease'
          }}
        >
          <div className="w-2/5">
            <Title
              ref={textareaRef}
              noteId={noteId}
              value={noteTitle}
              setNoteTitle={setNoteTitle}
              setNotes={setNotes}
              notes={notes}
              placeholder="NewTitle"
              className="mt-36 border-none text-4xl font-bold focus:ring-0 p-2 rounded resize-none mb-4"
              style={{ overflow: 'hidden', paddingLeft: '1px'}}
              isSynchronized={true}
              onKeyDown={handleKeyDown}
            />
          <div className="public-DraftEditor-content mb-32 w-full">
            <Editor
              editorState={editorState}
              onChange={onChange}
              plugins={plugins}
              blockStyleFn={blockStyleFn}
              ref={editorRef}
              handleKeyCommand={handleKeyCommand}
              keyBindingFn={keyBindingFn}
            />
          </div>
            <InlineToolbarComponent
              editorState={editorState}
              setEditorState={setEditorState}
              InlineToolbar={InlineToolbar}
              LinkButton={LinkButton}
              setSearchResults={setSearchResults}
              setIsModalOpen={setIsModalOpen}
              selectedText={selectedText}
            />
          </div>
        </div>
        <RhymeSearchModal
          searchResults={searchResults}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          position={selectionPosition}
          onWordSelect={handleWordSelect}
        />
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