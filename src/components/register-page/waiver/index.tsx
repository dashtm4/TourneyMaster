import React, { useState, useRef, useEffect } from 'react';
import { BindingCbWithTwo, IRegistration, BindingCbWithOne, IEventDetails } from 'common/models';
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
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: 'normal',
      position: 'relative',
      cursor: `url(../../../assets/scroll-cursor.png), auto`,
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
      zIndex: 1000,
    },
    hiddenButton: {
      visibility: 'hidden',
    },
    warnText: {
      width: '100%',
      textAlign: 'center',
      padding: '8px',
      position: 'sticky',
      top: 0,
      background: 'linear-gradient(to bottom, grey 0%, white 100%)',
      opacity: 0.5,
    },
  })
);

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

  const sendDataToPDF = (event: any) => {
    event.preventDefault();

    const htmlElement = document.getElementById('waiver-content');

    if (htmlElement !== null && htmlElement !== undefined) {

    //   let HTML_Width = htmlElement.getBoundingClientRect().width; `https://tourneymaster.s3.amazonaws.com/public/${event.desktop_icon_URL}`
    //   let HTML_Height = htmlElement.getBoundingClientRect().height;
    //   let top_left_margin = 15;
    //   let PDF_Width = HTML_Width+(top_left_margin*2);
    //   let PDF_Height = (PDF_Width*1.5)+(top_left_margin*2);
    //   let canvas_image_width = HTML_Width;
    //   let canvas_image_height = HTML_Height;
		
    //   let totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;
		

    //   html2canvas(htmlElement,{allowTaint:true})
    //   .then(function(canvas) {
    //     canvas.getContext('2d');
        
    //     let imgData = canvas.toDataURL("image/jpeg", 1.0);
    //     let pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);
    //       pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);
        
        
    //     for (let i = 1; i <= totalPDFPages; i++) { 
    //       pdf.addPage([PDF_Width, PDF_Height]);
    //       pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
    //     }
        
    //       pdf.save("HTML-Document.pdf");
    //       });

    //     }

      html2canvas(htmlElement).then((canvas: any) => {
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
    const waiverContent =
      content.waiver_content === null || !content.waiver_content
        ? 'Not found.'
        : `<div style="height: 220px"><div><h1 style="text-align: center">${event && event.event_name}</h1>` +
          `<h2 style="text-align: center">${participantName}</h2></div>` +
          `<img src="https://tourneymaster.s3.amazonaws.com/public/${event &&
            event.desktop_icon_URL}" style="position: absolute; top: 80px; right: 80px; max-width: 200px; max-height: 200px" /></div>` +
          content.waiver_content +
          `<h2 style="font-family: 'Segoe Script'; text-align: right">${signature}</h2>
        <h2 style="font-size: 12px; text-align: right">${agreedment}</h2>` +
          `<h3 style="font-size: 10px; text-align: right">${ip}</h3>
        <h3 style="font-size: 10px; text-align: right">${hash}</h3>`;
    return (
      <div className={classes.waiverContainer}>
        <div
          className={isComplete ? classes.buttonWrapp : classes.hiddenButton}
        >
          <Button
            onClick={sendDataToPDF}
            variant={ButtonVariant.CONTAINED}
            color={ButtonColors.PRIMARY}
            label={'Save to PDF'}
            icon={<GetAppIcon style={{ fill: '#FFFFFF' }} />}
            isIconRightSide={true}
          />
        </div>

        <div className={classes.waiverWrapp} ref={scrollRef}>
          <div className={!isBottom ? classes.warnText : classes.hiddenButton}>
            Scroll to the bottom of the waiver to enable signing of the document
          </div>
          <div
            id="waiver-content"
            className={classes.waiver}
            dangerouslySetInnerHTML={{ __html: waiverContent }}
          />
        </div>
        <div>
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
        </div>

        <div className={classes.errorText}>{error}</div>
      </div>
    );
  };

  return <div>{renderWaiver()}</div>;
};

export default Waiver;
