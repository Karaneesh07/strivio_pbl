// services/judge0Service.js
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// In-memory store for async execution results
const submissionStore = {};

/**
 * Creates a submission and immediately begins executing it locally.
 * Returns a "token" instantly so the polling mechanism works.
 */
const createSubmission = async (source_code, language_id, stdin) => {
  const token = uuidv4();
  
  // Set initial status to emulate Judge0
  submissionStore[token] = { status: 'Processing' };
  
  // Execute asynchronously
  executeLocal(token, source_code, stdin).catch(err => {
    submissionStore[token] = {
      status: 'Internal Error',
      error: err.message,
      output: '',
      compile_error: '',
      time: '0',
      memory: 0
    };
  });
  
  return token;
};

const executeLocal = async (token, source_code, stdin) => {
  const tmpDir = os.tmpdir();
  const scriptPath = path.join(tmpDir, `strivio_${token}.py`);
  
  try {
    fs.writeFileSync(scriptPath, source_code);
  } catch (err) {
    throw new Error('Failed to create tmp file for execution');
  }

  const startTime = process.hrtime();
  
  return new Promise((resolve) => {
    const pythonProcess = spawn('python', [scriptPath]);
    
    let stdoutData = '';
    let stderrData = '';
    
    // Set a strict 5-second timeout
    const timeoutId = setTimeout(() => {
      pythonProcess.kill('SIGKILL');
      submissionStore[token] = {
        status: 'Time Limit Exceeded',
        output: stdoutData,
        error: stderrData || 'Execution timed out > 5s',
        compile_error: '',
        time: '5.0',
        memory: 0
      };
      resolve();
    }, 5000);

    if (stdin) {
      pythonProcess.stdin.write(stdin);
      pythonProcess.stdin.end();
    } else {
      pythonProcess.stdin.end();
    }

    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      clearTimeout(timeoutId);
      const diff = process.hrtime(startTime);
      const seconds = (diff[0] + diff[1] / 1e9).toFixed(3);

      if (code === 0) {
        submissionStore[token] = {
          status: 'Accepted',
          output: stdoutData,
          error: '',
          compile_error: '',
          time: seconds,
          memory: 0
        };
      } else {
        submissionStore[token] = {
          status: 'Runtime Error',
          output: stdoutData,
          error: stderrData,
          compile_error: '', // Python compiles at runtime roughly, so it drops into standard err
          time: seconds,
          memory: 0
        };
      }
      
      // Cleanup
      try { fs.unlinkSync(scriptPath); } catch (e) {}
      resolve();
    });
  });
};

/**
 * Polling mechanism logic
 */
const pollSubmissionResult = async (token) => {
  let result;
  for (let i = 0; i < 20; i++) { // Max 10 seconds (20 * 500ms)
    result = submissionStore[token];
    if (result && result.status !== 'Processing') {
      return result;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return { status: 'Timeout', error: 'Polling timed out' };
};

module.exports = {
  createSubmission,
  pollSubmissionResult,
};
