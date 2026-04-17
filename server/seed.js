// server/seed.js — Problem Seeder for MySQL
const { query, testConnection } = require('./config/db');

async function seed() {
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('Abort: DB not connected.');
    process.exit(1);
  }

  try {
    console.log('🌱 Seeding problems...');
    
    console.log('🌱 Checking existing data...');
    
    // Check if problems already exist
    const { rows } = await query('SELECT COUNT(*) AS total FROM problems');
    const existingCount = rows[0].total;
    
    if (existingCount > 0) {
      console.log(`ℹ️ Already found ${existingCount} problems. Skip Seeding.`);
      process.exit(0);
    }

    console.log('🌱 Seeding fresh problem set into MySQL...');

    const problems = [
      {
        title: 'Two Sum',
        difficulty: 'Easy',
        tags: JSON.stringify(['array', 'hash-table']),
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.'
      },
      {
        title: 'Reverse Integer',
        difficulty: 'Medium',
        tags: JSON.stringify(['math']),
        description: 'Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.'
      },
      {
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        tags: JSON.stringify(['string', 'stack']),
        description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.'
      },
      {
        title: 'Merge Two Sorted Lists',
        difficulty: 'Easy',
        tags: JSON.stringify(['linked-list', 'recursion']),
        description: 'Merge two sorted linked lists and return it as a new sorted list. The new list should be made by splicing together the nodes of the first two lists.'
      },
      {
        title: 'Longest Palindromic Substring',
        difficulty: 'Medium',
        tags: JSON.stringify(['string', 'dynamic-programming']),
        description: 'Given a string s, return the longest palindromic substring in s.'
      }
    ];

    for (const p of problems) {
      const res = await query(
        'INSERT INTO problems (title, description, difficulty, tags) VALUES (?, ?, ?, ?)',
        [p.title, p.description, p.difficulty, p.tags]
      );
      
      const problemId = res.rows.insertId;
      console.log(`✅ Seeded: ${p.title} (ID: ${problemId})`);

      // Add a basic sample test case for Two Sum (ID 1)
      if (p.title === 'Two Sum') {
          await query(
            'INSERT INTO test_cases (problem_id, input, expected_output, is_hidden) VALUES (?, ?, ?, ?)',
            [problemId, '2 7 11 15\n9', '0 1', 0]
          );
      }
    }

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
