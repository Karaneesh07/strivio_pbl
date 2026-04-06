const db = require('../config/db');

const initialProblems = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'EASY',
    starter_code_java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}',
    starter_code_cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};',
    test_cases: JSON.stringify([
      { input: '[2,7,11,15]\n9', expected_output: '[0,1]' },
      { input: '[3,2,4]\n6', expected_output: '[1,2]' }
    ]),
    hidden_test_cases: JSON.stringify([
      { input: '[3,3]\n6', expected_output: '[0,1]' }
    ])
  },
  {
    title: 'Add Two Numbers',
    description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit.',
    difficulty: 'MEDIUM',
    starter_code_java: 'class Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        \n    }\n}',
    starter_code_cpp: 'class Solution {\npublic:\n    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n        \n    }\n};',
    test_cases: JSON.stringify([
      { input: '[2,4,3]\n[5,6,4]', expected_output: '[7,0,8]' }
    ]),
    hidden_test_cases: JSON.stringify([
      { input: '[0]\n[0]', expected_output: '[0]' }
    ])
  }
];

const seed = async () => {
  try {
    for (let prob of initialProblems) {
      await db.query(`
        INSERT INTO problems (title, description, difficulty, starter_code_java, starter_code_cpp, test_cases, hidden_test_cases)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [prob.title, prob.description, prob.difficulty, prob.starter_code_java, prob.starter_code_cpp, prob.test_cases, prob.hidden_test_cases]);
    }
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
