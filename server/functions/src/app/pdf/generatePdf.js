import puppeteer from 'puppeteer';
import request from 'sync-request';
import { Duplex } from 'stream';

const bufferToStream = (buffer) => {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

const generateAndReturnBody = async (html) => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setContent(html);
      const buffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          left: "10px",
          top: "10px",
          right: "10px",
          bottom: "10px"
        }
      });
      await browser.close();
      resolve(bufferToStream(buffer));
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
