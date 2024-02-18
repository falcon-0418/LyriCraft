import { EditorState, getDefaultKeyBinding } from 'draft-js';

interface EditorKeyActionsProps {
  editorState: EditorState;
  setEditorState: (state: EditorState) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export const editorKeyActions = ({ editorState, textareaRef }: EditorKeyActionsProps) => {
  const handleKeyCommand = (command: string) => {
    const isEditorEmpty = () => {
      return !editorState.getCurrentContent().hasText();
    };

    if (command === 'backspace' && isEditorEmpty()) {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const length = textareaRef.current.value.length;
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

  return { handleKeyCommand, keyBindingFn };
};
