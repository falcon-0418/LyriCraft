import React from 'react';
import CreateNoteButton from './createNoteButton';

interface Note {
  id: number;
  title: string;
}

interface SidebarProps {
  notes: Note[];
  onNoteCreated: (noteId: number | null) => void;
  onSelectNote: (noteId: number) => void;
  onDeleteNote: (noteId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ notes, onNoteCreated, onSelectNote, onDeleteNote }) => {
  return (
    <div className="h-full w-64 bg-gray-100 border-r border-gray-300">
      <div className="p-4">
        <h2 className="text-lg font-semibold">ノート</h2>
        <CreateNoteButton onNoteCreated={onNoteCreated} />
        <ul className="mt-4">
          {notes.map(note => (
            <li key={note.id} className="mb-2 p-2 bg-white rounded flex justify-between items-center">
              <span className="text-sm cursor-pointer" onClick={() => onSelectNote(note.id)}>
                {note.title}
              </span>
              <button className="text-red-500 text-xs" onClick={() => onDeleteNote(note.id)}>
                削除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
