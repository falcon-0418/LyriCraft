"use client"
import Link from "next/link";
import React, { useState } from 'react';
import { AiOutlineMenuFold } from "react-icons/ai";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-gray-100 z-50">
      <Link href="/" className="text-2xl font-bold text-gray-800 hover:bg-gray-200 p-2 rounded">LyriCraft</Link>
      <div className="sm:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-gray-200 rounded sm:hidden">
          <AiOutlineMenuFold size={30} />
        </button>
        <div className={`fixed inset-0 ${isOpen ? 'block' : 'hidden'} sm:hidden`} onClick={handleClose}></div>
      </div>

      <div className={`absolute top-12 right-5 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} sm:hidden`}>
        <Link href="/login" className="block px-4 py-2 text-gray-800"><span className="hover:bg-gray-200 p-1 rounded">ログイン</span></Link>
        <Link href="/signup" className="block px-4 py-2 text-gray-800"><span className="hover:bg-gray-200 p-1 rounded">サインアップ</span></Link>
      </div>
      <div className="hidden sm:flex space-x-4 ">
        <Link href="/login" className="text-gray-500 hover:bg-gray-200 p-2 rounded" >ログイン</Link>
        <span className="text-gray-300 mt-2">|</span>
        <Link href="/signup" className="text-gray-500 hover:bg-gray-200 p-2 rounded">サインアップ</Link>
      </div>
    </header>
  );
}
