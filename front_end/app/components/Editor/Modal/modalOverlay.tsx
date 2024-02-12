import React, { useEffect } from 'react';

const ModalOverlay: React.FC<{ isOpen: boolean; onClose: () => void; animate: boolean }> = ({
  isOpen,
  onClose,
  animate,
}) => {
  useEffect(() => {
    if (isOpen) {
      // モーダル表示中にページ全体のテキスト選択を無効にする
      document.body.style.userSelect = 'none';
    } else {
      // モーダルが閉じたら設定を解除する
      document.body.style.userSelect = '';
    }
    // コンポーネントのアンマウント時に設定を確実に解除する
    return () => {
      document.body.style.userSelect = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const className = `fixed inset-0 transition-opacity duration-300 ${animate ? 'opacity-100' : 'opacity-0'}`;
  return <div className={className} onClick={onClose} />;
};

export default ModalOverlay