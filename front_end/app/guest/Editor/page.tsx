"use client"
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { replaceText } from '../../components/Editor/editor/textUtils';
import Editor from '@draft-js-plugins/editor';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import createLinkPlugin from '@draft-js-plugins/anchor';
import createLinkifyPlugin from '@draft-js-plugins/linkify';

import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/anchor/lib/plugin.css';

import InlineToolbarComponent from '../../components/Editor/InlineToolbar/inlineToolbar';
import useSelectedText from '../../components/Editor/Hooks/useSelectedText'
import useSelectionPosition from '../../components/Editor/Hooks/useSelectionPosition';
import RhymeSearchModal from '../../components/Editor/Modal/searchResultModal';
import blockStyleFn from "../../components/Editor/InlineToolbar/blockStyleClasses";
import WritingButton from './writing';
import WritingAiButton from './writingAi';
import { Title } from '../../components/Editor/Title/title';
import  { editorKeyActions }  from '../../components/Editor/editor/editorKeyAction';
import { titleKeyActions } from '../../components/Editor/Title/titleKeyAction';

interface MyEditorProps {}

const MyEditor: React.FC<MyEditorProps> = () => {
  const [editorState, setEditorState] = useState(() => {
    const content = sessionStorage.getItem('guestContent');
    return content ? EditorState.createWithContent(convertFromRaw(JSON.parse(content))) : EditorState.createEmpty();
  });
  const [showEditor, setShowEditor] = useState(false);
  const [noteTitle, setNoteTitle] = useState(sessionStorage.getItem('guestTitle') || '');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selectedText = useSelectedText(editorState);
  const selectionPosition = useSelectionPosition();


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

  const editorActions = editorKeyActions({ editorState, setEditorState, textareaRef });
  const handleKeyCommand = editorActions.handleKeyCommand;
  const keyBindingFn = editorActions.keyBindingFn;

  const titleActions = titleKeyActions({
    textareaRef,
    onEnter: () => {
      const newState = EditorState.moveFocusToEnd(editorState);
      setEditorState(newState);
    }
  });
  const handleKeyDown = titleActions.handleKeyDown;

  const handleWordSelect = (word: string) => {
    const newEditorState = replaceText(editorState, word);
    setEditorState(newEditorState);
    setIsModalOpen(false); // モーダルを閉じる
  };

  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="w-2/5">
        <Title
          ref={textareaRef}
          className="mt-36 text-4xl border-none font-bold focus:ring-0 rounded resize-none mb-4"
          style={{ overflow: 'hidden', paddingLeft: '1px'}}
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
          <div className="flex justify-start mt-4">
            <WritingButton onToggle={() => setShowEditor(!showEditor)}/>
            <WritingAiButton/>
          </div>
        )}
          {showEditor && (
            <div>
              <div
                ref={editorRef}
                className="public-DraftEditor-content mb-4 w-full"
                style={{ position: 'static' }}
              >
                <Editor
                  editorState={editorState}
                  onChange={onChange}
                  plugins={plugins}
                  blockStyleFn={blockStyleFn}
                  placeholder='何か書いてみよう。'
                  handleKeyCommand={handleKeyCommand}
                  keyBindingFn={keyBindingFn}
                />
              </div>
              <div className="bpsgbes">
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
              <RhymeSearchModal
                searchResults={searchResults}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                position={selectionPosition}
                onWordSelect={handleWordSelect}
              />
            </div>
          )}
        </div>
      </div>
    );
};

export default MyEditor;
