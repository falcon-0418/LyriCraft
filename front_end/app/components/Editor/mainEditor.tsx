"use client"
import React, { useMemo, useState } from 'react';
import { EditorState } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import InlineToolbarComponent from './inlineToolbar';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import blockStyleFn from "./blockStyleClasses";
import createLinkPlugin from '@draft-js-plugins/anchor';
import '@draft-js-plugins/anchor/lib/plugin.css';
import createLinkifyPlugin from '@draft-js-plugins/linkify';

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
  const [readonly, setReadOnly] = useState<boolean>(false);

  const onChange = (value: EditorState) => {
    setEditorState(value);
  };

  return (
    <div>
      <div>
        {readonly ? (
          <button className="text-xl rounded-full bg-indigo-500 text-white px-5 py-1.5 mr-5 my-7" onClick={() => setReadOnly(false)}>Edit</button>
        ) : (
          <button className="text-xl rounded-full bg-indigo-500 text-white px-5 py-1.5 mr-5 my-7" onClick={() => setReadOnly(true)}>ReadOnly</button>
        )}
      </div>
      <Editor
        editorState={editorState}
        onChange={onChange}
        plugins={plugins}
        readOnly={readonly}
        blockStyleFn={blockStyleFn}
      />
       <InlineToolbarComponent
        editorState={editorState}
        setEditorState={setEditorState}
        InlineToolbar={InlineToolbar}
        LinkButton={LinkButton}
      />
    </div>
  );
};

export default MyEditor;
