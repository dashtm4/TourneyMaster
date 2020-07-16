import React, { useState, useRef, useEffect } from 'react';
import { BindingCbWithTwo, IRegistration, BindingCbWithOne, IEventDetails } from 'common/models';
import 'react-phone-input-2/lib/high-res.css';
import { Input, Button, Toasts, Loader } from 'components/common';
import { IIndividualsRegister } from 'common/models/register';
import GetAppIcon from '@material-ui/icons/GetApp';
import axios from 'axios';
import MD5 from 'crypto-js/md5';
import { ButtonColors, ButtonVariant } from "common/enums/buttons";
import moment from 'moment';
import styles from './styles.module.scss';

axios.defaults.baseURL = process.env.REACT_APP_PUBLIC_API_BASE_URL!;


type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IRegistrationDetailsProps {
  data: Partial<IIndividualsRegister>;
  content: IRegistration | null;
  event: IEventDetails | null;
  onChange: BindingCbWithTwo<string, string | number>;
  setDisabledButton: BindingCbWithOne<boolean>;
}

const Waiver = ({
  data,
  content,
  event,
  onChange,
  setDisabledButton,
}: IRegistrationDetailsProps) => {
  const [isBottom, setIsBottom] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoadFile, setIsLoadFile] = useState(false);
  const [name, setName] = useState('');
  const [IP, setIP] = useState('');
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLInputElement>(null);

  const onScroll = () => {
    if (scrollRef.current) {
      const isCurrentBottom =
        scrollRef.current.scrollTop + 1 >=
        scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      setIsBottom(isCurrentBottom);
    }
  };

  useEffect(() => {
    loadPrevData();
    loadSignatureParams();
  });

  useEffect(() => {
    const waiverElement = scrollRef.current;
    if (!waiverElement) {
      return;
    }
    if (waiverElement.clientHeight < 500) {
      setIsBottom(true);
    }
    waiverElement.addEventListener('scroll', onScroll);
    return () => {
      if (scrollRef && waiverElement) {
        waiverElement.removeEventListener('scroll', onScroll);
      }
    };
  }, []);

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
      setError('First name and last name must match the values from step 1 (above).');
    } else {
      setError('');
      setIsComplete(true);
      setDisabledButton(false);
      onChange(
        'waiver_signature',
        JSON.stringify({ ip: IP, hash, name: inputedValue })
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

  const downloadPDF = (pdf: string) => {
    const linkSource = `data:application/pdf;base64,${pdf}`;
    const downloadLink = document.createElement("a");
    const fileName = `Waiver-${event?.event_name}.pdf`;

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
    setIsLoadFile(false);
};

  const sendDataToPDF = async (event: any) => {
    event.preventDefault();

    if (!content) {
      return;
    }

    try {
      setIsLoadFile(true);
      await axios.post('https://api.tourneymaster.org/public/services/generate-pdf', {
        html: getWaiverContent(),
      }).then(response => downloadPDF(response.data.body));
    } catch (err) {
      return Toasts.errorToast(err.message);
    };
  };

  const getWaiverContent = () => {
    if (!content) {
      return '';
    }
    const signature = data.waiver_signature
      ? JSON.parse(data.waiver_signature).name
      : '';
    const hash = data.waiver_signature
      ? `Cryptographic hash of ` + JSON.parse(data.waiver_signature).hash
      : '';
    const ip = data.waiver_signature
      ? `Signing IP address: ` + JSON.parse(data.waiver_signature).ip
      : '';
    const date = moment(data.waiver_sign_datetime).format('MMM D, YYYY');
    const time = moment(data.waiver_sign_datetime).format('hh:mm:ss');
    const agreedment = data.waiver_sign_datetime
      ? `Agreed and Accepted on ${date} at ${time}`
      : '';
    const participantName = `Participant Name: ${data.participant_first_name} ${data.participant_last_name}`;
    return content.waiver_content === null || !content.waiver_content
        ? 'Not found.'
        : `<div style="display: flex; flex-wrap: wrap;
        justify-content: center">` +
          `<div style="width: calc( 100% - 200px ); min-width: 300px"><h1 style="text-align: center">${event && event.event_name}</h1>` +
          `<h2 style="text-align: center">${participantName}</h2></div><img src="https://tourneymaster.s3.amazonaws.com/public/${event &&
            event.desktop_icon_URL}" style="max-width: 200px; max-height: 200px; margin-bottom: 8px" /></div>` +
          content.waiver_content +
          `<h2 style="font-family: 'Segoe Script'; text-align: right">${signature}</h2>
        <h2 style="font-size: 12px; text-align: right; height: 30px">${agreedment}</h2>` +
          `<h3 style="font-size: 10px; text-align: right; height: 14px">${ip}</h3>
        <h3 style="font-size: 10px; text-align: right; height: 14px">${hash}</h3>`;
  };

  const renderWaiver = () => {
    const waiverContent = getWaiverContent();
    return (
      <div className={styles.waiverContainer}>
        <div className={isComplete ? styles.buttonWrapp : styles.hiddenButton}>
          {isLoadFile
          ? <Loader />
          : <Button
              onClick={sendDataToPDF}
              variant={ButtonVariant.CONTAINED}
              color={ButtonColors.PRIMARY}
              label={'Save to PDF'}
              icon={<GetAppIcon style={{ fill: '#FFFFFF' }} />}
              isIconRightSide={true}
            />}
        </div>

        <div className={styles.waiverWrapp} ref={scrollRef}>
          <div
            className={
              !isBottom && !isComplete ? styles.warnText : styles.hiddenButton
            }
          >
            Scroll to the bottom of the waiver to enable signing of the document
          </div>
          <div
            id="waiver-content"
            className={styles.waiver}
            dangerouslySetInnerHTML={{ __html: waiverContent }}
          />
        </div>
        <div>
          <div className={styles.inputWrapp}>
            <h4>If you agree to these terms and conditions, please retype your first and last name.</h4>
            <Input
              value={name}
              onChange={onInputName}
              placeholder={'First name and Last name'}
              disabled={!isBottom || isComplete}
              isRequired={true}
            />
          </div>
        </div>

        <div className={styles.errorText}>{error}</div>
      </div>
    );
  };

  return <div>{renderWaiver()}</div>;
};

export default Waiver;