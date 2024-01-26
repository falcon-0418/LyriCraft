import React, { useState, useEffect } from 'react';
import UserProfile from './userProfile';
import CreateNoteButton from './createNoteButton';
import axiosInstance from './axiosConfig';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get('/profile');
        const userData = response.data.data;
        setUserName(userData.attributes.name);
        setUserEmail(userData.attributes.email);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="h-full w-64 bg-gray-100 border-r border-gray-300">
      <div className="mb-4 p-4">
        <h3 className="text-lg font-semibold cursor-pointer" onClick={toggleModal}>{userName}</h3>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold">ノート</h2>
        <CreateNoteButton onNoteCreated={onNoteCreated} />
        <ul className="mt-4">
          {Array.isArray(notes) && notes.map(note => (
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

      <div
        className={`absolute inset-0
                    transition-opacity
                    duration-300
                    ease-in-out
                    ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
       <UserProfile
         userName={userName}
         userEmail={userEmail}
         setIsModalOpen={setIsModalOpen}
       />
      </div>
    </div>
  );
};

export default Sidebar;