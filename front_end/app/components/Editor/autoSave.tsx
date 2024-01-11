import { useEffect, useCallback } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface AutoSaveComponentProps {
    editorState: EditorState;
    noteId: number | null;
    noteTitle: string;
}

const AutoSaveComponent = ({ editorState, noteId, noteTitle }: AutoSaveComponentProps) => {
  const saveContent = useCallback((editorState: EditorState, noteTitle: string) => {
    console.log("saveContent called with noteId:", noteId);
    if (!noteId) return;
    const contentState = editorState.getCurrentContent();
    const rawContent = JSON.stringify(convertToRaw(contentState));
    console.log("Saving content:", rawContent);

    const apiUrl = `http://localhost:3003/api/v1/notes/${noteId}`;

    fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: noteTitle,
        body: rawContent,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save the note');
      }
      return response.json();
    })
    .then(data => {
      console.log('Note saved successfully:', data);
    })
    .catch(error => {
      console.error('Error saving note:', error);
    });
  }, [noteId]);

  useEffect(() => {
    const saveChanges = () => {
      saveContent(editorState, noteTitle);
    };

    const editorSubject = new Subject<EditorState>();
    const titleSubject = new Subject<string>();

    const editorSubscription = editorSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(saveChanges);

    const titleSubscription = titleSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(saveChanges);

    editorSubject.next(editorState);
    titleSubject.next(noteTitle);

    return () => {
      editorSubscription.unsubscribe();
      titleSubscription.unsubscribe();
      editorSubject.complete();
      titleSubject.complete();
    };
  }, [editorState, noteTitle, saveContent]);

  return null;
};

export default AutoSaveComponent;
