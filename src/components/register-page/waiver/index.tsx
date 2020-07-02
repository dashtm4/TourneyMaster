///<reference path= '../../../../node_modules/react-froala-wysiwyg/lib/index.d.ts' />

import React, { useState, useRef, useEffect } from 'react';
import { BindingCbWithTwo, IRegistration, BindingCbWithOne } from 'common/models';
import 'react-phone-input-2/lib/high-res.css';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import { Input } from 'components/common';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
import { IIndividualsRegister } from 'common/models/register';
import axios from 'axios';
import MD5 from 'crypto-js/md5';

axios.defaults.baseURL = process.env.REACT_APP_PUBLIC_API_BASE_URL!;

const useStyles = makeStyles(
  createStyles({
    waiveWrapp: {
      backgroundColor: 'white',
      width: '100%',
      maxHeight: '500px',
      overflow: 'auto',
      padding: '40px',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: 'normal',
    },
    fullName: {
      fontFamily: 'Segoe Script',
      textAlign: 'right',
      height: '40px',
      marginTop: '8px',
    },
    inputWrapp: {
      margin: '8px',
    },
    errorText: {
      color: 'red',
      marginLeft: '8px',
    },
  })
);

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IRegistrationDetailsProps {
  data: Partial<IIndividualsRegister>;
  content: IRegistration | null;
  eventName: string | undefined;
  onChange: BindingCbWithTwo<string, string | number>;
  setDisabledButton: BindingCbWithOne<boolean>;
}

const Waiver = ({ data, content, eventName, onChange, setDisabledButton }: IRegistrationDetailsProps) => {
  const [isBottom, setIsBottom] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [name, setName] = useState('');
  const [IP, setIP] = useState('');
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLInputElement>(null);

  const onScroll = () => {
    if (scrollRef.current) {
      const isCurrentBottom =
        Math.round(scrollRef.current.scrollTop) >=
        scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      setIsBottom(isCurrentBottom);
    }
  };

  useEffect(() => {
    loadPrevData();
    loadSignatureParams();
  }, []);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }
    if (scrollRef.current.clientHeight < 500) {
      setIsBottom(true);
    }
    scrollRef.current.addEventListener('scroll', onScroll);
    return () => {
      if (scrollRef && scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', onScroll);
      }
    };
  }, []);

  const classes = useStyles();

  const onInputName = async (e: InputTargetValue) => {
    const inputedValue = e.target.value;
    if (!data.registrant_first_name || !data.registrant_last_name) {
      setError('First name and Last name is not found.');
      return;
    }
    setName(inputedValue);
    if (
      inputedValue.trim() !==
      data.registrant_first_name + ' ' + data.registrant_last_name
    ) {
      setError('First name and Last name is not match.');
    } else {
      setError('');
      setIsComplete(true);
      setDisabledButton(false);
      onChange(
        'waiver_signature',
        JSON.stringify({ ip: IP, hash: hash, name: inputedValue })
      );
    }
  };

  const loadSignatureParams = async () => {
    const res = await axios.get('https://api.ipify.org');
    setIP(res.data);
    if (content === null || content.waiver_content === null) {
      return;
    }
    setHash(MD5(content.waiver_content).toString());
    const currentDate = new Date();
    onChange('waiver_sign_datetime', currentDate.toISOString());
  };

  const loadPrevData = () => {
    if (!data.waiver_signature) {
      setDisabledButton(true);
      return;
    }
    setName(JSON.parse(data.waiver_signature).name);
    setIsComplete(true);
    setDisabledButton(false);
  };




  const renderWaiver = () => {
    if (!content) {
      return;
    }
    const signature = data.waiver_signature
      ? JSON.parse(data.waiver_signature).name
      : '';

    const waiverContent =
      content.waiver_content === null || !content.waiver_content
        ? 'Not found.'
        : `<h1 style="text-align: center">${eventName}</h1>` +
        content.waiver_content +
        `<h2 style="font-family: 'Segoe Script'; text-align: right">${signature}</h2>`;
    return (
      <div>
        <div className={classes.waiveWrapp} ref={scrollRef}>
          <FroalaEditorView model={waiverContent} />
        </div>
        <div className={classes.inputWrapp}>
          <Input
            label={'Retype your First and Last name.'}
            value={name}
            onChange={onInputName}
            placeholder={'First name and Last name'}
            disabled={!isBottom || isComplete}
            isRequired={true}
          />
        </div>
        <div className={classes.errorText}>{error}</div>
      </div>
    );
  };

  return <div>{renderWaiver()}</div>;
};

export default Waiver;
