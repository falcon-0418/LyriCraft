import React, { useState, useEffect } from 'react';
import UserProfile from './userProfile';
import CreateNoteButton from './createNoteButton';
import axiosInstance from './axiosConfig';
import { NoteData } from '@/types/types';
import { FaRegTrashAlt } from "react-icons/fa";



interface SidebarProps {
  notes: NoteData[];
  onNoteCreated: (newNote: NoteData | null) => void;
  onSelectNote: (noteId: number) => void;
  onDeleteNote: (noteId: number) => void;
  sidebarWidth: number;
  setSidebarWidth: React.Dispatch<React.SetStateAction<number>>;
  isSidebarOpen: boolean;
  style?: React.CSSProperties;
}

const Sidebar: React.FC<SidebarProps> = ({ notes, onNoteCreated, onSelectNote, onDeleteNote, sidebarWidth, setSidebarWidth, isSidebarOpen }) => {
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

  const handleDrag = (e: MouseEvent) => {
    const newWidth = Math.min(Math.max(e.clientX, 250), 400);
    setSidebarWidth(newWidth);
    localStorage.setItem('sidebarWidth', newWidth.toString());
  };

  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleDrag as any);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    window.addEventListener('mousemove', handleDrag as any);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="sidebar-container" style={{
      width: isSidebarOpen ? `${sidebarWidth}px` : "0",
      position: 'relative',
      transition: 'width 0.3s ease'
    }}>
      <div className="sidebar-content" style={{
        opacity: isSidebarOpen ? 1 : 0,
        transform: isSidebarOpen ? 'translateX(0)' : `translateX(-100%)`,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: isSidebarOpen ? 'auto' : 'none'
      }}>
        <div className="mb-4 p-1">
          <h3 className="py-2 px-6 text-lg text-gray-500 bg-white hover:bg-gray-100 border-r font-semibold cursor-pointer"
              onClick={toggleModal}>{userName}
          </h3>
        </div>
          <div className="p-1">
            <div className="p-1 flex justify-between items-center">
              <h2 className="mt-16 text-lg text-gray-500 font-semibold">My Notes</h2>
              <CreateNoteButton onNoteCreated={onNoteCreated} />
            </div>
            <ul className="overflow-auto mb-24" style={{ height: 'calc(100vh - 200px)' }}>
              {notes.map(note => (
                <li
                  key={note.id}
                  className="hover:bg-gray-100 text-gray-500 mb-1 p-2 bg-white rounded flex justify-between items-center"
                  onClick={() => onSelectNote(note.id)}
                >
                  <span className="text-sm cursor-pointer">
                    {note.title || "New Title"}
                  </span>
                  <button
                    className="text-gray-500 text-xs hover:bg-gray-300 p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('本当に削除しますか？')) {
                        onDeleteNote(note.id);
                      }
                    }}
                  >
                    <FaRegTrashAlt />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>


      <div
        className="w-2 bg-gray-400 cursor-col-resize absolute right-0 top-0 bottom-0"
        onMouseDown={handleMouseDown}
      />

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
