// controllers/codeController.js
const { query } = require('../config/db');
const { createSubmission, pollSubmissionResult } = require('../services/judge0Service');

/**
 * Runs code against sample test cases (usually for testing)
 * POST /api/code/run
 */
const runCode = async (req, res) => {
  const { source_code, language_id, problem_id, custom_stdin } = req.body;

  if (!source_code || !language_id || !problem_id) {
    return res.status(400).json({ success: false, message: 'source_code, language_id, and problem_id are required.' });
  }

  try {
    let testCases = [];
    
    if (custom_stdin) {
      testCases = [{ input: custom_stdin, expected_output: '(Custom Input)', is_custom: true }];
    } else {
      // Fetch public test cases from DB
      const { rows } = await query('SELECT * FROM test_cases WHERE problem_id = ? AND is_hidden = 0', [problem_id]);
      testCases = rows;
    }

    if (testCases.length === 0) {
      return res.status(404).json({ success: false, message: 'No public test cases found.' });
    }

    const results = await Promise.all(testCases.map(async (tc) => {
      try {
        const token = await createSubmission(source_code, language_id, tc.input);
        const executionResult = await pollSubmissionResult(token);

        const trimmedOutput = (executionResult.output || '').trim();
        const trimmedExpected = (tc.expected_output || '').trim();
        
        let status = 'Passed';
        if (!tc.is_custom) {
          status = (trimmedOutput === trimmedExpected && executionResult.status === 'Accepted') ? 'Passed' : 'Failed';
        } else {
          status = executionResult.status === 'Accepted' ? 'Executed' : executionResult.status;
        }

        return {
          input: tc.input,
          expected_output: tc.expected_output,
          output: executionResult.output,
          status: executionResult.compile_error ? 'Compilation Error' : (executionResult.error ? executionResult.status : status),
          error: executionResult.error || executionResult.compile_error,
          time: executionResult.time,
          memory: executionResult.memory,
        };
      } catch (err) {
        return {
          input: tc.input,
          expected_output: tc.expected_output,
          status: 'Error',
          error: err.message,
        };
      }
    }));

    const passedCount = results.filter(r => r.status === 'Passed' || r.status === 'Executed').length;

    return res.json({
      success: true,
      total: results.length,
      passed: passedCount,
      failed: results.length - passedCount,
      results,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Runs code against ALL test cases and stores submission result
 * POST /api/code/submit
 */
const submitCode = async (req, res) => {
  const { source_code, language_id, problem_id, language_name } = req.body;
  const userId = req.user.id;

  try {
    // 1. Fetch ALL test cases (hidden + sample)
    const { rows: testCases } = await query('SELECT * FROM test_cases WHERE problem_id = ?', [problem_id]);
    if (testCases.length === 0) return res.status(404).json({ success: false, message: 'No test cases for this problem.' });

    // 2. Execute all test cases
    const results = await Promise.all(testCases.map(async (tc) => {
      const token = await createSubmission(source_code, language_id, tc.input);
      const exec = await pollSubmissionResult(token);
      const passed = exec.output.trim() === tc.expected_output.trim() && exec.status === 'Accepted';
      return { ...exec, passed };
    }));

    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = total - passed;
    const overallStatus = failed === 0 ? 'Passed' : (results.some(r => r.compile_error) ? 'Compilation Error' : 'Failed');
    
    // Aggregate max time and memory
    const maxTime = Math.max(...results.map(r => parseFloat(r.time || 0)));
    const maxMemory = Math.max(...results.map(r => parseInt(r.memory || 0)));

    // 3. Save submission to DB
    const result = await query(
      `INSERT INTO submissions 
       (user_id, problem_id, code, language, status, passed_count, total_count, execution_time, memory) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, problem_id, source_code, language_name || 'unknown', overallStatus, passed, total, maxTime, maxMemory]
    );

    const submissionId = result.rows.insertId;

    // 4. Update streak if fully passed
    if (overallStatus === 'Passed') {
      const { updateStreak } = require('./submissionController');
      await updateStreak(userId);
    }

    return res.json({
      success: true,
      total,
      passed,
      failed,
      status: overallStatus,
      execution_time: maxTime,
      memory: maxMemory,
      submission_id: submissionId
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  runCode,
  submitCode,
};
