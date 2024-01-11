"use client"
import { Editor as DraftEditor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import { useState } from "react";

const MyEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  return <DraftEditor editorState={editorState} onChange={setEditorState} />;
};

export default MyEditor;