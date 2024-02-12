import { useState, useEffect } from 'react';
import { RefObject } from 'react';

const sidebarAnimationDuration = 500;

const useEditorPosition = (editorRef: RefObject<HTMLDivElement>, isSidebarOpen: boolean, sidebarWidth: number) => {
  const [editorRect, setEditorRect] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useEffect(() => {
    const updateEditorRect = () => {
      setTimeout(() => {
        if (editorRef.current) {
          const rect = editorRef.current.getBoundingClientRect();
          setEditorRect({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          });
        }
      }, sidebarAnimationDuration);
    };

    updateEditorRect();
    window.addEventListener('resize', updateEditorRect);

    return () => {
      window.removeEventListener('resize', updateEditorRect);
    };
  }, [editorRef, isSidebarOpen, sidebarWidth]);

  return editorRect;
};

export default useEditorPosition;
