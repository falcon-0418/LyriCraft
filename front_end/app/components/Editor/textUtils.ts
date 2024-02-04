import { Modifier, EditorState } from 'draft-js';

export const replaceText = (
    editorState: EditorState,
    replacementText: string
  ): EditorState => { 
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();


  const newContentState = Modifier.replaceText(
    contentState,
    selectionState,
    replacementText
  );

  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    'insert-characters'
  );

  return EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());
};
