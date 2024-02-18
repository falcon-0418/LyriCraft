// UseAutoScrollModal.js
import { useEffect, useState } from 'react';
import { RefObject } from 'react';

const useAutoScrollModal = (modalRef: RefObject<HTMLElement>, isOpen: boolean): number => {
  const [modalHeight, setModalHeight] = useState(0);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const modalRect = modalRef.current.getBoundingClientRect();
      setModalHeight(modalRect.height);

      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const modalBottom = modalRect.top + modalRect.height;

      if (modalBottom > viewportHeight) {
        const scrollOffset = modalBottom - viewportHeight + scrollY + 20;
        window.scrollTo({
          top: scrollOffset,
          behavior: 'smooth'
        });
      }
    }
  }, [isOpen, modalHeight, modalRef]);

  return modalHeight;
};

export default useAutoScrollModal;
