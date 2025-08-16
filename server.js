// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

app.post('/translate', async (req, res) => {
  const { code, fromLang, toLang } = req.body;

  try {
    const prompt = `
You are a programming language translator.
Convert the following code from ${fromLang} to ${toLang}:

${code}

Translated ${toLang} code:
`;

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });

    const translatedCode = response.data.choices[0].message.content;
    res.json({ translatedCode });
  } catch (error) {
    console.error("Translation error:", error.response?.data || error.message);
    res.status(500).json({ error: 'Translation failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
