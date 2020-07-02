///<reference path= "../../../../node_modules/react-froala-wysiwyg/lib/index.d.ts" />

import React, { useState } from 'react';
import { IRegistration } from 'common/models/registration';
import { BindingCbWithTwo } from 'common/models';
import styles from './styles.module.scss';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';

import FroalaEditor from 'react-froala-wysiwyg';

interface IRegistrationDetailsProps {
  data: IRegistration | undefined;
  isEdit: boolean;
  onChange?: BindingCbWithTwo<string, string | number>;
}

const Waiver = ({ data, isEdit, onChange }: IRegistrationDetailsProps) => {
  const [model, setModel] = useState(data?.waiver_content);
  const config = {
    placeholderText: 'This is the Froala Editor',
    toolbarButtons: {
      moreText: {
        'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
      },
      moreParagraph: {
        'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
      },
      moreRich: {
        'buttons': ['insertLink', 'insertImage', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertHR']
      },
      moreMisc: {
        'buttons': ['undo', 'redo', 'fullscreen', 'spellChecker', 'selectAll', 'html', 'help'],
        'align': 'right',
        'buttonsVisible': 2
      },
    },
  };

  const onModelChange = (text: string) => {
    setModel(text);
    onChange!('waiver_content', text);
  };

  const renderWaiver = () => {
    if (!data) {
      return;
    }
    if (isEdit && onChange) {
      return (
        <div className={styles.redactor}>
          <FroalaEditor
            tag="textarea"
            model={model}
            onModelChange={onModelChange}
            config={config}
          />
        </div>
      );
    }
    if (data.waiver_content === null) {
      return <div>Not found waiver.</div>;
    }
    return (
      <div className={styles.waiveWrapp}>
        <FroalaEditorView model={data.waiver_content} />
      </div>
    );
  };

  return <div>{renderWaiver()}</div>;
};

export default Waiver;
