import { useMemo } from 'react';
import { EditorState } from 'draft-js';

const useSelectedText = (editorState: EditorState) => {
  return useMemo(() => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const startKey = selection.getStartKey();
      const startOffset = selection.getStartOffset();
      const endOffset = selection.getEndOffset();
      const content = editorState.getCurrentContent();
      const block = content.getBlockForKey(startKey);
      return block.getText().slice(startOffset, endOffset);
    }
    return '';
  }, [editorState]);
};

export default useSelectedText;