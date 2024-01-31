interface TitleKeyActionsProps {
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    onEnter: () => void;
  }

  export const titleKeyActions = ({ onEnter }: TitleKeyActionsProps) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter') {
        const keyboardEvent = event.nativeEvent as KeyboardEvent;

        if (event.shiftKey || keyboardEvent.isComposing) {
          return;
        }

        event.preventDefault();
        onEnter();
      }
    };

    return { handleKeyDown };
  };