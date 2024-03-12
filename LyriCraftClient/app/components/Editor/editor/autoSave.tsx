import { useEffect, useCallback } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import axiosInstance from './axiosConfig';

interface AutoSaveComponentProps {
  editorState: EditorState;
  noteId: number | null;
  noteTitle: string;
}

const AutoSaveComponent = ({ editorState, noteId, noteTitle }: AutoSaveComponentProps) => {
  const saveContent = useCallback(async () => {
    if (!noteId) return;
      const contentState = editorState.getCurrentContent();
      const rawContent = JSON.stringify(convertToRaw(contentState));

      try {
        const response = await axiosInstance.put(`/user/notes/${noteId}`, {
          title: noteTitle,
          body: rawContent,
        });
      } catch (error) {
        console.error('Error saving note:', error);
      }
  }, [editorState, noteId, noteTitle]);

  const autoSaveSubject = new Subject();

  useEffect(() => {
    const autoSaveSubscription = autoSaveSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe(() => {
      saveContent();
    });

    return () => {
      autoSaveSubscription.unsubscribe();
    };
  }, [saveContent]);

  useEffect(() => {
    autoSaveSubject.next({ editorState, noteTitle });
  }, [editorState, noteTitle]);

  return null;
};

export default AutoSaveComponent;
