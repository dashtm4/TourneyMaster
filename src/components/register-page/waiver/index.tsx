﻿import React, { useState, useRef, useEffect } from 'react';
import { BindingCbWithTwo, IRegistration, BindingCbWithOne } from 'common/models';
import 'react-phone-input-2/lib/high-res.css';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Input, Button } from 'components/common';
import { IIndividualsRegister } from 'common/models/register';
import GetAppIcon from '@material-ui/icons/GetApp';
import axios from 'axios';
import MD5 from 'crypto-js/md5';
import { ButtonColors, ButtonVariant } from "common/enums/buttons";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';

axios.defaults.baseURL = process.env.REACT_APP_PUBLIC_API_BASE_URL!;

const useStyles = makeStyles(
  createStyles({
    waiverContainer: {
      position: 'relative',
    },
    waiverWrapp: {
      backgroundColor: 'white',
      width: '100%',
      maxHeight: '500px',
      overflow: 'auto',
      padding: '40px',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: 'normal',
    },
    waiver: {
      padding: '40px',
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
    buttonWrapp: {
      position: 'absolute',
      right: '20px',
      top: '10px',
    },
    hiddenButton: {
      visibility: 'hidden',
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

const Waiver = ({
  data,
  content,
  eventName,
  onChange,
  setDisabledButton,
}: IRegistrationDetailsProps) => {
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
      const currentDate = new Date();
      onChange('waiver_sign_datetime', currentDate.toISOString());
    }
  };

  const loadSignatureParams = async () => {
    const res = await axios.get('https://api.ipify.org');
    setIP(res.data);
    if (content === null || content.waiver_content === null) {
      return;
    }
    setHash(MD5(content.waiver_content).toString());
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

  const sendDataToPDF = (event: any) => {
    event.preventDefault();

    const htmlElement = document.getElementById('waiver-content');

    if (htmlElement !== null && htmlElement !== undefined) {
      html2canvas(htmlElement).then(function (canvas: any) {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 595;
        const pageHeight = 842;
        const imgHeight = (canvas.height * imgWidth) / canvas.width - 20;
        let heightLeft = imgHeight;

        const doc = new jsPDF('p', 'pt');
        let position = 10;
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.save('Waiver.pdf');
      });
    }
  };

  const renderWaiver = () => {
    if (!content) {
      return;
    }
    const signature = data.waiver_signature
      ? JSON.parse(data.waiver_signature).name
      : '';
    const date = moment(data.waiver_sign_datetime).format('MMM D, YYYY');
    const time = moment(data.waiver_sign_datetime).format('hh:mm:ss');
    const agreedment = data.waiver_sign_datetime
      ? `Agreed and Accepted on ${date} at ${time}`
      : '';
    const waiverContent =
      content.waiver_content === null || !content.waiver_content
        ? 'Not found.'
        : `<h1 style="text-align: center">${eventName}</h1>` +
          content.waiver_content +
          `<h2 style="font-family: 'Segoe Script'; text-align: right">${signature}</h2>
        <h2 style="font-size: 12px; text-align: right">${agreedment}</h2>`;
    return (
      <div className={classes.waiverContainer}>
        <div
          className={isComplete ? classes.buttonWrapp : classes.hiddenButton}
        >
          <Button
            onClick={sendDataToPDF}
            variant={ButtonVariant.CONTAINED}
            color={ButtonColors.PRIMARY}
            label={'Save'}
            icon={<GetAppIcon style={{ fill: '#FFFFFF' }} />}
            isIconRightSide={true}
          />
        </div>
        <div className={classes.waiverWrapp} ref={scrollRef}>
          <div
            id="waiver-content"
            className={classes.waiver}
            dangerouslySetInnerHTML={{ __html: waiverContent }}
          />
        </div>
        <div className={classes.inputWrapp}>
          <Input
            label={'If you agree to these terms and conditions, please retype your first and last name.'}
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
