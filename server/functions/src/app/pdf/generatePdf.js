import pdf from 'html-pdf';
import request from 'sync-request';

const generateAndReturnBody = async (html) => {
  const options = {
    format: 'A4',
    "border": {
      "top": "10px",
      "right": "10px",
      "bottom": "10px",
      "left": "10px"
    },
  };

  return new Promise((resolve, reject) => {
    try {
      pdf.create(html, options).toStream(function (err, content) {
        if (err) {
          throw err;
        }
        resolve(content);
      });
    } catch (e) {
      reject(e)
    }
  });
}

export const generatePdf = async ({ html, styles }) => {
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
