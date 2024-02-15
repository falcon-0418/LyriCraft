import { Modifier, EditorState } from 'draft-js';

export const replaceOrAppendText = (
  editorState: EditorState,
  replacementText: string,
  append: boolean
): EditorState => {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  let newContentState;

  if (append) {
    // 選択テキストの右側に配置
    const blockKey = selectionState.getStartKey();
    const block = contentState.getBlockForKey(blockKey);
    const insertionPoint = selectionState.getEndOffset();
    const newSelectionState = selectionState.merge({
      anchorOffset: insertionPoint,
      focusOffset: insertionPoint,
    });

    newContentState = Modifier.insertText(
      contentState,
      newSelectionState,
      `${replacementText}`
    );
  } else {
    // 選択テキストを置換
    newContentState = Modifier.replaceText(
      contentState,
      selectionState,
      replacementText
    );
  }

  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    'insert-characters'
  );

  return EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());
};