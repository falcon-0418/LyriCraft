import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import axiosInstance from '../editor/axiosConfig';
import { NoteData } from '@/types/types';

interface TitleProps {
  noteId: number | null;
  value: string;
  setNoteTitle: React.Dispatch<React.SetStateAction<string>>;
  setNotes: React.Dispatch<React.SetStateAction<NoteData[]>>;
  notes: NoteData[];
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void
  className: string;
  style?: React.CSSProperties;
  rows?: number;
  isSynchronized?: boolean;
}

export const Title = forwardRef<HTMLTextAreaElement, TitleProps>(
  ({ noteId, value, setNoteTitle, setNotes, notes, placeholder, className, style, rows, isSynchronized, onKeyDown, onChange }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    const adjustTextareaHeight = () => {
      const target = textareaRef.current;
      if (target) {
        target.style.height = 'auto';
        const newHeight = Math.min(target.scrollHeight, window.innerHeight);
        target.style.height = `${newHeight}px`;
      }
    };

    useEffect(() => {
      adjustTextareaHeight();
      if (noteId !== null && textareaRef.current) {
        textareaRef.current.focus();
      }
    }, [value, noteId]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e);
      } else {
        const newTitle = e.target.value;
        setNoteTitle(newTitle);

        if (isSynchronized && noteId !== null) {
          updateNoteTitle(newTitle, noteId);
        }
      }
    };

    const updateNoteTitle = async (title: string, noteId: number) => {
      const updatedNotes = notes.map(note =>
        note.id === noteId ? { ...note, title } : note
      );
      setNotes(updatedNotes);

      try {
        await axiosInstance.put(`/user/notes/${noteId}`, { title });
      } catch (error) {
        console.error('Error updating note title:', error);
      }
    };

    return (
      <textarea
        ref={textareaRef}
        className={className}
        style={style}
        placeholder={placeholder}
        value={value}
        onChange={handleTitleChange}
        onKeyDown={onKeyDown}
        rows={rows || 1}
      />
    );
  }
);
