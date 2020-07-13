import { generatePdf } from '../app/pdf/generatePdf.js';

export default api => {
  api.post('/generate-pdf', async (req, res) => {
    try {
      const result = await generatePdf(req.body);

      res.json({
        success: true,
        result,
      });
    } catch (err) {
      res.json({
        success: false,
        message: err.message,
      });
    }
  });

  return api;
};
