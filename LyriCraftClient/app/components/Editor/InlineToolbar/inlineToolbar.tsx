import React from 'react';
import { EditorState } from 'draft-js';
import { Separator } from '@draft-js-plugins/inline-toolbar';
import {
  // ItalicButton,
  BoldButton,
  // UnderlineButton,
  HeadlineOneButton,
  // HeadlineTwoButton,
  // HeadlineThreeButton,
} from '@draft-js-plugins/buttons';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import RhymeSearchButton from './rhymeSearchButton';


interface InlineToolbarComponentProps {
  editorState: EditorState;
  setEditorState: (editorState: EditorState) => void;
  InlineToolbar: any;
  // LinkButton: any;
  setSearchResults: React.Dispatch<React.SetStateAction<any[]>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedText: string;
}

const InlineToolbarComponent: React.FC<InlineToolbarComponentProps> = ({
  InlineToolbar,
  // LinkButton,
  setSearchResults,
  setIsModalOpen,
  selectedText
}) => {

  return (
    <InlineToolbar>
      {(externalProps: any) => (
        <>
          {/* <ItalicButton {...externalProps} /> */}
          <BoldButton {...externalProps} />
          {/* <UnderlineButton {...externalProps} /> */}
          <Separator {...externalProps} />
          <HeadlineOneButton {...externalProps} />
          {/* <HeadlineTwoButton {...externalProps} /> */}
          {/* <HeadlineThreeButton {...externalProps} /> */}
         {/* <LinkButton {...externalProps} /> */}
          <Separator {...externalProps} />
          <RhymeSearchButton
            selectedText={selectedText}
            setSearchResults={setSearchResults}
            setIsModalOpen={setIsModalOpen}
          />
        </>
      )}
    </InlineToolbar>
  );
};

export default InlineToolbarComponent;