import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { createWorker } from 'tesseract.js';
import { initAnalyzer, analyzeText } from './analyzer';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'KanjiKana Backend is running' });
});

// Endpoint to handle image upload, OCR, and annotation
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    let textToAnalyze = req.body.text || '';

    // If an image is provided, run OCR
    if (req.file) {
      console.log('Running OCR on uploaded image...');
      const worker = await createWorker('jpn');
      const ret = await worker.recognize(req.file.buffer);
      textToAnalyze = ret.data.text;
      await worker.terminate();
      console.log('OCR Result:', textToAnalyze);
    }

    if (!textToAnalyze) {
      return res.status(400).json({ error: 'No text or image provided' });
    }

    // Analyze text and add furigana
    const htmlResult = analyzeText(textToAnalyze);

    res.json({
      original: textToAnalyze,
      html: htmlResult
    });
  } catch (error) {
    console.error('Error analyzing text:', error);
    res.status(500).json({ error: 'Failed to analyze text' });
  }
});

// Initialize kuromoji before starting the server
initAnalyzer().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to start server due to analyzer init error', err);
});
