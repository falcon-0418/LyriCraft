"use client"
import React, {  useState, useMemo, Dispatch, SetStateAction } from 'react';
import InlineToolbarComponent from '../components/Editor/InlineToolbar/inlineToolbar';
import { EditorState, ContentState } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import createLinkPlugin from '@draft-js-plugins/anchor';
import createLinkifyPlugin from '@draft-js-plugins/linkify';

const TestPage = () => {
  // Draft.js Editorの初期化
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(ContentState.createFromText('テスト用のテキスト'))
  );
  const [searchResults, setSearchResults] = useState<never[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedText = "テストテキスト";
  // InlineToolbarプラグインの初期化
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

  const onChange = (value: EditorState) => {
    setEditorState(value);
  };

  return (
    <div>
      <h1>テストページ</h1>
      <div style={{ padding: 20 }}>
        <Editor
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
        />
       <InlineToolbarComponent
          editorState={editorState}
          setEditorState={setEditorState}
          InlineToolbar={InlineToolbar}
          LinkButton={LinkButton} // 実際の LinkButton コンポーネントを提供してください。
          setSearchResults={setSearchResults as Dispatch<SetStateAction<any[]>>}
          setIsModalOpen={setIsModalOpen}
          selectedText={selectedText}
        />
      </div>
    </div>
  );
};

export default TestPage;
