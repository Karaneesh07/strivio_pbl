// services/judge0Service.js
const axios = require('axios');
require('dotenv').config();

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com';

const judge0Api = axios.create({
  baseURL: JUDGE0_API_URL,
  headers: {
    'content-type': 'application/json',
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': RAPIDAPI_HOST,
  },
});

/**
 * Creates a submission in Judge0
 * @param {string} source_code 
 * @param {number} language_id 
 * @param {string} stdin 
 * @returns {Promise<string>} Token for the submission
 */
const createSubmission = async (source_code, language_id, stdin) => {
  try {
    const response = await judge0Api.post('/submissions', {
      source_code: Buffer.from(source_code).toString('base64'),
      language_id,
      stdin: stdin ? Buffer.from(stdin).toString('base64') : null,
      base64_encoded: true,
    }, {
      params: { wait: 'false', fields: 'token' }
    });
    return response.data.token;
  } catch (err) {
    console.error('Judge0 Create Error:', err.response?.data || err.message);
    throw new Error('Failed to create submission in Judge0');
  }
};

/**
 * Fetches the result of a submission by token
 * @param {string} token 
 * @returns {Promise<Object>} Result object
 */
const getSubmissionResult = async (token) => {
  try {
    const response = await judge0Api.get(`/submissions/${token}`, {
      params: { base64_encoded: 'true', fields: 'stdout,stderr,compile_output,status_id,status,time,memory' }
    });
    
    const { stdout, stderr, compile_output, status, time, memory } = response.data;
    
    return {
      output: stdout ? Buffer.from(stdout, 'base64').toString('utf-8') : '',
      error: stderr ? Buffer.from(stderr, 'base64').toString('utf-8') : '',
      compile_error: compile_output ? Buffer.from(compile_output, 'base64').toString('utf-8') : '',
      status: status.description,
      time: time || '0',
      memory: memory || 0,
    };
  } catch (err) {
    console.error('Judge0 Get Result Error:', err.response?.data || err.message);
    throw new Error('Failed to fetch submission result from Judge0');
  }
};

/**
 * Polls Judge0 until the submission is finished
 * @param {string} token 
 * @returns {Promise<Object>}
 */
const pollSubmissionResult = async (token) => {
  let result;
  for (let i = 0; i < 10; i++) { // Max 10 attempts
    result = await getSubmissionResult(token);
    if (result.status !== 'In Queue' && result.status !== 'Processing') {
      return result;
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
  }
  return result;
};

module.exports = {
  createSubmission,
  getSubmissionResult,
  pollSubmissionResult,
};
