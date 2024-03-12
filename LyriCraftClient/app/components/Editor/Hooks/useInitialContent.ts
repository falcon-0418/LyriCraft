import { useState, useEffect } from 'react';
import { EditorState, convertFromRaw, genKey } from 'draft-js';
import useParseTextToBlocks from './useParseTextToBlocks';

export const useInitialContent = (filePath: string) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    const loadContent = async () => {
      const response = await fetch(filePath);
      const text = await response.text();
      const blocks = useParseTextToBlocks(text); // Updated to use the parsing function

      // Convert to Draft.js understandable format
      const rawContentState = {
        blocks: blocks.map(block => ({
          key: block.getKey(),
          text: block.getText(),
          type: block.getType(),
          depth: block.getDepth(),
          inlineStyleRanges: [],
          entityRanges: [],
          data: {}
        })),
        entityMap: {}
      };
      // Generate EditorState
      const contentState = convertFromRaw(rawContentState);
      setEditorState(EditorState.createWithContent(contentState));
    };

    loadContent();
  }, [filePath]);

  return editorState;
};