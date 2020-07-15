import pdf from 'html-pdf';
import request from 'sync-request';

const generateAndReturnBody = async html => {
  const options = {
    format: 'A4',
    border: {
      top: '10px',
      right: '10px',
      bottom: '10px',
      left: '10px',
    },
    // phantomPath: './node_modules/phantomjs-prebuilt/bin/phantomjs',
  };

  return new Promise((resolve, reject) => {
    try {
      console.log('Before create');
      pdf.create(html, options).toBuffer(function (err, content) {
        if (err) {
          throw err;
        }
        resolve(content);
      });
    } catch (e) {
      console.log('Error in create: ', e);
      reject(e);
    }
  });
};

export const generatePdf = async ({ html, styles }) => {
  process.env.FONTCONFIG_PATH = '/var/task/fonts';

  const extraStyle = '<style>ul, ul li {list-style: none;}</style>';
  let content = extraStyle + html;
  if (styles) {
    const req = request('GET', styles);
    if (!req.isError() && req.statusCode === 200) {
      const body = req.getBody('utf8');
      content = `<style>${body}</style>${content}`;
    } else {
      throw new Error('Styles is not loaded');
    }
  }
  return generateAndReturnBody(content);
};
