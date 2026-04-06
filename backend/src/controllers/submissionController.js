const judge0 = require('../services/judge0Service');
const db = require('../config/db');

// Utility to normalize output for comparison
const normalize = (str) => {
  if (!str) return '';
  return str.toString().trim().replace(/\r\n/g, '\n');
};

const runCode = async (req, res) => {
  const { problemId, code, language } = req.body;
  try {
    const problem = await db.query('SELECT test_cases FROM problems WHERE id = $1', [problemId]);
    if (problem.rows.length === 0) return res.status(404).json({ error: 'Problem not found' });

    const testCases = problem.rows[0].test_cases; // Array of {input, expected_output}
    const results = [];

    for (let testCase of testCases) {
      const output = await judge0.executeCode(code, language, testCase.input, testCase.expected_output);
      results.push({
        input: testCase.input,
        expectedOutput: testCase.expected_output,
        actualOutput: output.stdout,
        status: output.status,
        passed: normalize(output.stdout) === normalize(testCase.expected_output)
      });
    }

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitCode = async (req, res) => {
  const { problemId, code, language, userId } = req.body;
  try {
    const problemQuery = await db.query('SELECT hidden_test_cases FROM problems WHERE id = $1', [problemId]);
    if (problemQuery.rows.length === 0) return res.status(404).json({ error: 'Problem not found' });

    const hiddenTestCases = problemQuery.rows[0].hidden_test_cases;
    let passedCount = 0;
    const failedCases = [];

    for (let i = 0; i < hiddenTestCases.length; i++) {
      const tc = hiddenTestCases[i];
      const output = await judge0.executeCode(code, language, tc.input, tc.expected_output);
      const isPassed = normalize(output.stdout) === normalize(tc.expected_output);
      
      if (isPassed) {
        passedCount++;
      } else {
        failedCases.push({
          caseNum: i + 1,
          expected: tc.expected_output,
          actual: output.stdout || output.stderr || output.compile_output,
          status: output.status
        });
      }
    }

    const resultStatus = passedCount === hiddenTestCases.length ? 'ACCEPTED' : 'REJECTED';

    // Store submission
    const submissionResult = await db.query(`
      INSERT INTO submissions (user_id, problem_id, code, language, status, passed_count, total_count)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [userId, problemId, code, language, resultStatus, passedCount, hiddenTestCases.length]);

    const submissionId = submissionResult.rows[0].id;

    // Journal Entry (NEW FEATURE)
    await db.query(`
      INSERT INTO journals (user_id, submission_id, title, notes, improvement_tag)
      VALUES ($1, $2, $3, $4, $5)
    `, [userId, submissionId, `Attempt at Problem ${problemId}`, `Solved ${passedCount}/${hiddenTestCases.length} cases.`, resultStatus === 'ACCEPTED' ? 'Success' : 'Debugging']);

    // Update Streak
    if (resultStatus === 'ACCEPTED') {
      await updateStreak(userId);
    }

    res.json({
      passed: passedCount,
      total: hiddenTestCases.length,
      failedCases,
      status: resultStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStreak = async (userId) => {
  const user = await db.query('SELECT current_streak, last_submission_date FROM users WHERE id = $1', [userId]);
  const { current_streak, last_submission_date } = user.rows[0];
  
  const today = new Date().toISOString().split('T')[0];
  const lastDate = last_submission_date ? last_submission_date.toISOString().split('T')[0] : null;

  if (lastDate === today) return; // Already solved today

  let newStreak = 1;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastDate === yesterdayStr) {
    newStreak = current_streak + 1;
  }

  await db.query(`
    UPDATE users SET 
    current_streak = $1, 
    longest_streak = GREATEST(longest_streak, $1),
    last_submission_date = $2
    WHERE id = $3
  `, [newStreak, today, userId]);
};

module.exports = { runCode, submitCode };
