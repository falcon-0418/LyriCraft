"use client"
import React, { useEffect, useMemo, useState, useRef } from 'react';
import  { EditorState, convertFromRaw, convertToRaw, getDefaultKeyBinding } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import 'draft-js/dist/Draft.css';
import InlineToolbarComponent from '../../components/Editor/inlineToolbar';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import blockStyleFn from "../../components/Editor/blockStyleClasses";
import createLinkPlugin from '@draft-js-plugins/anchor';
import '@draft-js-plugins/anchor/lib/plugin.css';
import createLinkifyPlugin from '@draft-js-plugins/linkify';
import WritingButton from './writing';
import WritingAiButton from './writingAi';

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

  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const [noteTitle, setNoteTitle] = useState(sessionStorage.getItem('guestTitle') || '');

// エディタの状態
  const [editorState, setEditorState] = useState(() => {
    const content = sessionStorage.getItem('guestContent');
    return content ? EditorState.createWithContent(convertFromRaw(JSON.parse(content))) : EditorState.createEmpty();
  });

  // タイトルの変更をセッションストレージに保存
  useEffect(() => {
    sessionStorage.setItem('guestTitle', noteTitle);
  }, [noteTitle]);

  // エディタの内容が変更されたときのハンドラ
  const onChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const content = JSON.stringify(convertToRaw(newEditorState.getCurrentContent()));
    sessionStorage.setItem('guestContent', content);
  };

  // タイトルが変更されたときのハンドラ
  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteTitle(e.target.value);
  };


  const editorRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      const keyboardEvent = event.nativeEvent as KeyboardEvent;

      if (event.shiftKey) {
        return;
      }

      if (!keyboardEvent.isComposing) {
        event.preventDefault();

        const newState = EditorState.moveFocusToEnd(editorState);
        setEditorState(newState);
      }
    }
  };

  const adjustTextareaHeight = () => {
    const target = textareaRef.current;
    if (target) {
      target.style.height = 'auto';
      const newHeight = Math.min(target.scrollHeight, window.innerHeight);
      target.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustTextareaHeight();
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isEditorEmpty = (editorState: EditorState) => {
    return !editorState.getCurrentContent().hasText();
  };

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    if (command === 'backspace' && isEditorEmpty(editorState)) {
      if (textareaRef.current) {
        const length = textareaRef.current.value.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(length, length);
      }
      return 'handled';
    }
    return 'not-handled';
  };

  const keyBindingFn = (e: React.KeyboardEvent<{}>) => {
    if (e.key === 'backspace') {
      return 'backspace';
    }
    return getDefaultKeyBinding(e);
  };

  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="w-2/5">
        <textarea
          className="mt-36 text-4xl border-none font-bold focus:ring-0 rounded resize-none mb-4 "
          placeholder="NewTitle"
          value={noteTitle}
          onChange={handleTitleChange}
          onInput={handleTextareaInput}
          onKeyDown={handleKeyDown}
          ref={textareaRef}
          style={{ overflow: 'hidden', paddingLeft: '1px'}}
          rows={1}
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
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
};

export default MyEditor;
