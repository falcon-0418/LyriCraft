import { useState, useEffect, useRef } from 'react';

const useModalSize = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalSize, setModalSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (modalRef.current) {
      const { width, height } = modalRef.current.getBoundingClientRect();
      setModalSize({ width, height });
    }
  }, [modalRef.current]); 
  return { modalSize, modalRef };
};

export default useModalSize;
