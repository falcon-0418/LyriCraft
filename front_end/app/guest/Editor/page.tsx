"use client"
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { replaceOrAppendText } from '../../components/Editor/editor/textUtils';
import Editor from '@draft-js-plugins/editor';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
// import createLinkPlugin from '@draft-js-plugins/anchor';
// import createLinkifyPlugin from '@draft-js-plugins/linkify';

import '@draft-js-plugins/anchor/lib/plugin.css';

import InlineToolbarComponent from '../../components/Editor/InlineToolbar/inlineToolbar';
import useSelectedText from '../../components/Editor/Hooks/useSelectedText'
import useSelectionPosition from '../../components/Editor/Hooks/useSelectionPosition';
import useEditorPosition from '@/app/components/Editor/Hooks/useEditorPosition';
import { useInitialContent } from '@/app/components/Editor/Hooks/useInitialContent';
import blockStyleFn from "../../components/Editor/InlineToolbar/blockStyleClasses";
import WritingButton from './writing';
import WritingAiButton from './writingAi';
import { Title, TitleRef } from '../../components/Editor/Title/title';
import  { editorKeyActions }  from '../../components/Editor/editor/editorKeyAction';
import { titleKeyActions } from '../../components/Editor/Title/titleKeyAction';
import SearchResultModal from '../../components/Editor/Modal/searchResultModal';
import SharedLayout from '@/app/layout/sharedLayout';

interface MyEditorProps {}

const MyEditor: React.FC<MyEditorProps> = () => {
  const initialEditorState = useInitialContent('/defaultContent.txt');
  const [editorState, setEditorState] = React.useState<EditorState>(() => EditorState.createEmpty());
  const [noteTitle, setNoteTitle] = useState(() => {
    return sessionStorage.getItem('guestTitle') || 'テキスト選択で韻を探そう!';
  });
  useEffect(() => {
    const content = sessionStorage.getItem('guestContent');
    if (content) {
      setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(content))));
    } else {
      setEditorState(initialEditorState);
    }
    sessionStorage.setItem('guestTitle', noteTitle);
  }, [initialEditorState, noteTitle]);

  const [showEditor, setShowEditor] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<TitleRef>(null);
  const selectedText = useSelectedText(editorState);
  const selectionPosition = useSelectionPosition(isModalOpen);
  const editorPosition = useEditorPosition(editorRef, showEditor, 0);

  const editorActions = editorKeyActions({ editorState, setEditorState, textareaRef });
  const handleKeyCommand = editorActions.handleKeyCommand;
  const keyBindingFn = editorActions.keyBindingFn;

  const [plugins, InlineToolbar, /* LinkButton */] = useMemo(() => {
    // const linkPlugin = createLinkPlugin({ placeholder: 'https://...' });
    // const linkifyPlugin = createLinkifyPlugin();
    const inlineToolbarPlugin = createInlineToolbarPlugin();
    return [
      [inlineToolbarPlugin, /* linkPlugin, linkifyPlugin */],
      inlineToolbarPlugin.InlineToolbar,
      /* linkPlugin.LinkButton */,
    ];
  }, []);

  useEffect(() => {
    sessionStorage.setItem('guestTitle', noteTitle);
  }, [noteTitle]);

  const onChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const content = JSON.stringify(convertToRaw(newEditorState.getCurrentContent()));
    sessionStorage.setItem('guestContent', content);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteTitle(e.target.value);
  };


  const titleActions = titleKeyActions({
    textareaRef,
    onEnter: () => {
      const newState = EditorState.moveFocusToEnd(editorState);
      setEditorState(newState);
    }
  });
  const handleKeyDown = titleActions.handleKeyDown;

  const handleWordSelect = (word: string, append: boolean) => {
    const newEditorState = replaceOrAppendText(editorState, word, append);
    setEditorState(newEditorState);
    setIsModalOpen(false);
  };

  return (
    <SharedLayout>
      <div className="flex justify-center items-start min-h-screen z-1">
        <div className="w-5/6 p-1 sm:w-4/5 md:w-3/5">
          <Title
            ref={titleRef}
            className="mt-36 text-4xl text-gray-700 border-none font-bold focus:ring-0 rounded resize-none mb-4 w-full pl-1 overflow-hidden text-gray"
            placeholder="NewTitle"
            value={noteTitle}
            onChange={handleTitleChange}
            onKeyDown={handleKeyDown}
            noteId={null}
            setNoteTitle={() => {}}
            setNotes={() => {}}
            notes={[]}
          />
          {!showEditor && (
            <div className="flex frex-col justify-start sm:flex-row justify-start mt-4">
              <WritingButton onToggle={() => setShowEditor(!showEditor)}/>
              <WritingAiButton/>
            </div>
          )}
          {showEditor && (
            <div
             ref={editorRef}
             className="public-DraftEditor-content text-gray-700 mb-48 w-full z-1"
            >
              <Editor
                ref={editorRef}
                editorState={editorState}
                onChange={onChange}
                plugins={plugins}
                blockStyleFn={blockStyleFn}
                placeholder='何か書いてテキスト選択してみよう'
                handleKeyCommand={handleKeyCommand}
                keyBindingFn={keyBindingFn}
              />
              <InlineToolbarComponent
                editorState={editorState}
                setEditorState={setEditorState}
                InlineToolbar={InlineToolbar}
                // LinkButton={LinkButton}
                setSearchResults={setSearchResults}
                setIsModalOpen={setIsModalOpen}
                selectedText={selectedText}
              />
            </div>
          )}
        </div>
        <SearchResultModal
          searchResults={searchResults}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          position={selectionPosition}
          editorPosition={editorPosition}
          onWordSelect={handleWordSelect}
        />
      </div>
    </SharedLayout>
  );
};

export default MyEditor;
