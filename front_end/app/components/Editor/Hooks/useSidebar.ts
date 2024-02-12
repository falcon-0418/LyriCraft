import { useState, useEffect } from 'react';

const useSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => JSON.parse(localStorage.getItem('isSidebarOpen') || 'true'));
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const storedWidth = localStorage.getItem('sidebarWidth');
    return storedWidth ? parseInt(storedWidth, 10) : 250;
  });

  useEffect(() => {
    localStorage.setItem('isSidebarOpen', JSON.stringify(isSidebarOpen));
    if (isSidebarOpen && sidebarWidth <= 0) {
      const newWidth = 250; 
      setSidebarWidth(newWidth);
      localStorage.setItem('sidebarWidth', String(newWidth));
    } else if (isSidebarOpen) {
      localStorage.setItem('sidebarWidth', String(sidebarWidth));
    }
  }, [isSidebarOpen, sidebarWidth]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev: boolean) => !prev);
  };

  return { isSidebarOpen, toggleSidebar, sidebarWidth, setSidebarWidth };
};

export default useSidebar;