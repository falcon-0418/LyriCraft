import React from 'react';
import { EditorState } from 'draft-js';
import { Separator } from '@draft-js-plugins/inline-toolbar';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
} from '@draft-js-plugins/buttons';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';

interface InlineToolbarComponentProps {
  editorState: EditorState;
  setEditorState: (editorState: EditorState) => void;
  InlineToolbar: any;
  LinkButton: any;
}

const InlineToolbarComponent: React.FC<InlineToolbarComponentProps> = ({ InlineToolbar, LinkButton }) => {
  return (
    <InlineToolbar>
      {(externalProps: any) => (
        <>
          <ItalicButton {...externalProps} />
          <BoldButton {...externalProps} />
          <UnderlineButton {...externalProps} />
          <Separator {...externalProps} />
          <HeadlineOneButton {...externalProps} />
          <HeadlineTwoButton {...externalProps} />
          <HeadlineThreeButton {...externalProps} />
          <LinkButton {...externalProps} />
        </>
      )}
    </InlineToolbar>
  );
};

export default InlineToolbarComponent;
