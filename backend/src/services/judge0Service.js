const axios = require('axios');
require('dotenv').config();

const JUDGE0_URL = process.env.JUDGE0_URL;
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

const languageIds = {
  java: 62,
  cpp: 54,
  javascript: 63
};

const executeCode = async (code, language, input, expectedOutput) => {
  try {
    const response = await axios.post(`${JUDGE0_URL}/submissions`, {
      source_code: Buffer.from(code).toString('base64'),
      language_id: languageIds[language.toLowerCase()],
      stdin: Buffer.from(input || '').toString('base64'),
      expected_output: Buffer.from(expectedOutput || '').toString('base64'),
    }, {
      params: { base64_encoded: 'true', wait: 'false' },
      headers: {
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    });

    const token = response.data.token;
    return await pollSubmission(token);
  } catch (error) {
    console.error('Judge0 submission error:', error.response?.data || error.message);
    throw new Error('Failed to submit code to execution engine');
  }
};

const pollSubmission = async (token) => {
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    const response = await axios.get(`${JUDGE0_URL}/submissions/${token}`, {
      params: { base64_encoded: 'true' },
      headers: {
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    });

    const status = response.data.status.id;
    if (status !== 1 && status !== 2) { // 1: In Queue, 2: Processing
      return {
        stdout: response.data.stdout ? Buffer.from(response.data.stdout, 'base64').toString() : '',
        stderr: response.data.stderr ? Buffer.from(response.data.stderr, 'base64').toString() : '',
        compile_output: response.data.compile_output ? Buffer.from(response.data.compile_output, 'base64').toString() : '',
        time: response.data.time,
        memory: response.data.memory,
        status: response.data.status.description,
        statusId: status
      };
    }

    retries++;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error('Code execution timed out');
};

module.exports = { executeCode };
