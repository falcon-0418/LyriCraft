"use client"
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'
import useSelectedText from '../Hooks/useSelectedText'
import useSelectionPosition from '../Hooks/useSelectionPosition';
import useEditorPosition from '../Hooks/useEditorPosition';
import useSidebar from '../Hooks/useSidebar';

import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import '@draft-js-plugins/anchor/lib/plugin.css';

import InlineToolbarComponent from '../InlineToolbar/inlineToolbar';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import createLinkPlugin from '@draft-js-plugins/anchor';
import createLinkifyPlugin from '@draft-js-plugins/linkify';
import blockStyleFn from "../InlineToolbar/blockStyleClasses";

import axiosInstance from './axiosConfig';
import AutoSaveComponent from './/autoSave';
import Sidebar from "../Sidebar/sidebar";
import { Title } from '../Title/title';
import { NoteData } from '@/types/types';
import NoteActions,{ handleNoteCreated, handleSelectNote, handleDeleteNote } from '../Sidebar/noteAction';

import { titleKeyActions } from '../Title/titleKeyAction';
import { editorKeyActions } from './/editorKeyAction';
import SearchResultModal from '../Modal/searchResultModal';
import { replaceOrAppendText } from './/textUtils';

import { RiMenuFoldFill, RiMenuUnfoldFill } from "react-icons/ri";
import { decorator } from '../../Decorator/linkDecorator';

interface MyEditorProps {}

const MyEditor: React.FC<MyEditorProps> = () => {

  const [editorState, setEditorState] = React.useState<EditorState>(EditorState.createEmpty(decorator));

  const contentState = editorState.getCurrentContent();
  const rawContentState = convertToRaw(contentState);
  const jsonContentState = JSON.stringify(rawContentState);
  console.log(jsonContentState);

  const [notes, setNotes] = useState<NoteData[]>([]);
  const [noteId, setNoteId] = useState<number | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>("");

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

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const selectedText = useSelectedText(editorState);
  const selectionPosition = useSelectionPosition(isModalOpen);

  const router = useRouter();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const { isSidebarOpen, toggleSidebar, sidebarWidth, setSidebarWidth } = useSidebar();
  const editorPosition = useEditorPosition(editorRef, isSidebarOpen, sidebarWidth);

  const editorActions = editorKeyActions({ editorState, setEditorState, textareaRef });
  const handleKeyCommand = editorActions.handleKeyCommand;
  const keyBindingFn = editorActions.keyBindingFn;

  const onChange = (value: EditorState) => {
    setEditorState(value);
  };

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/login');
    }
  }, [router]);

  const onNewNoteCreated = async (newNote: NoteData | null) => {
    if (newNote !== null) {
      await handleNoteCreated(newNote.id, setNotes, notes);
      setNoteId(newNote.id);
      setNoteTitle(newNote.title);
      setEditorState(EditorState.createEmpty());
    }
  };

  const onSelectNote = async (selectedNoteId: number) => {
    await handleSelectNote(selectedNoteId, setNoteId, setNoteTitle, setEditorState);

    localStorage.setItem('lastSelectedNoteId', selectedNoteId.toString());
    if (textareaRef.current) {
      textareaRef.current.focus();
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

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axiosInstance.get('/user/notes');
        let fetchedNotes = response.data.data.map((noteItem: any) => ({
          id: parseInt(noteItem.id, 10),
          title: noteItem.attributes.title,
          body: noteItem.attributes.body,
        }));

        setNotes(fetchedNotes);
        const lastSelectedNoteId = localStorage.getItem('lastSelectedNoteId');
        if (fetchedNotes.length > 0) {
          const mostRecentNote = lastSelectedNoteId
            ? fetchedNotes.find((note: NoteData) => note.id.toString() === lastSelectedNoteId) || fetchedNotes[0]
            : fetchedNotes[0];
          setNoteId(mostRecentNote.id);
          setNoteTitle(mostRecentNote.title);
          setEditorState(EditorState.createWithContent(
            convertFromRaw(JSON.parse(mostRecentNote.body))));
            decorator
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

  const handleWordSelect = (word: string, append: boolean) => {
    const newEditorState = replaceOrAppendText(editorState, word, append);
    setEditorState(newEditorState);
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <div className="fixed top-0 left-0 bottom-0"style={{
        width: isSidebarOpen ? `${sidebarWidth}px` : '0',
        transition: 'width 0.5s ease'

      }}>
        <Sidebar
          notes={notes}
          onSelectNote={onSelectNote}
          onDeleteNote={onDeleteNote}
          onNoteCreated={onNewNoteCreated}
          setSidebarWidth={setSidebarWidth}
          isSidebarOpen={isSidebarOpen}
          sidebarWidth={sidebarWidth}
          noteId={noteId}
        />
      </div>
      <button onClick={toggleSidebar} style={{
        position: 'fixed',
        top: 0,
        left: isSidebarOpen ? sidebarWidth : 0,
        transition: 'left 0.5s ease'
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
            transition: 'margin-left 0.5s ease'
          }}
        >
          <div className="w-full p-10 sm:w-4/5 md:w-3/5 ">
            <Title
              ref={textareaRef}
              noteId={noteId}
              value={noteTitle}
              setNoteTitle={setNoteTitle}
              setNotes={setNotes}
              notes={notes}
              placeholder="NewTitle"
              className="mt-36 w-full border-none bg-stone-50 text-2xl sm:text-3xl md:text-4xl font-bold focus:ring-0 p-2 rounded resize-none mb-4 text-gray-700"
              style={{ overflow: 'hidden', paddingLeft: '1px'}}
              isSynchronized={true}
              onKeyDown={handleKeyDown}
            />
            <div ref={editorRef} className="public-DraftEditor-content mb-48 w-full text-gray-700">
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
        <SearchResultModal
          searchResults={searchResults}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          position={selectionPosition}
          editorPosition={editorPosition}
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