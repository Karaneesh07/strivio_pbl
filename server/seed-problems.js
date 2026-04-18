// server/seed-problems.js — Seeds 100 DSA problems with 10 test cases each
require('dotenv').config();
const { query, testConnection } = require('./config/db');

// ── Problem data (100 problems across 10 categories) ───────────────
const PROBLEMS = [
  // ──────────── ARRAYS ─────────────────────────────────────────────
  { title: 'Two Sum', difficulty: 'Easy', tags: ['array','hash-table'],
    desc: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input has exactly one solution and you may not use the same element twice.' },
  { title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', tags: ['array','dynamic-programming'],
    desc: 'Given an array prices where prices[i] is the price of a stock on day i, maximize profit by choosing a single buy and sell day. Return 0 if no profit is possible.' },
  { title: 'Contains Duplicate', difficulty: 'Easy', tags: ['array','hash-table','sorting'],
    desc: 'Given an integer array nums, return true if any value appears at least twice, false if every element is distinct.' },
  { title: 'Product of Array Except Self', difficulty: 'Medium', tags: ['array','prefix-sum'],
    desc: 'Given an integer array nums, return an array answer such that answer[i] equals the product of all elements except nums[i]. Run in O(n) without division.' },
  { title: 'Maximum Subarray', difficulty: 'Medium', tags: ['array','divide-and-conquer','dynamic-programming'],
    desc: "Given an integer array nums, find the contiguous subarray with the largest sum and return its sum. (Kadane's Algorithm)" },
  { title: 'Merge Intervals', difficulty: 'Medium', tags: ['array','sorting'],
    desc: 'Given an array of intervals, merge all overlapping intervals and return an array of the non-overlapping intervals.' },
  { title: 'Rotate Array', difficulty: 'Medium', tags: ['array','math','two-pointers'],
    desc: 'Given an integer array nums, rotate it to the right by k steps (k is non-negative).' },
  { title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', tags: ['array','binary-search'],
    desc: 'Given a sorted rotated array of unique elements, find the minimum element in O(log n).' },
  { title: 'Trapping Rain Water', difficulty: 'Hard', tags: ['array','two-pointers','dynamic-programming','stack'],
    desc: 'Given n non-negative integers representing an elevation map, compute how much water can be trapped after rain.' },
  { title: 'Sliding Window Maximum', difficulty: 'Hard', tags: ['array','queue','sliding-window','monotonic-queue'],
    desc: 'Given an array of integers and a sliding window of size k, return the max values for each window position.' },

  // ──────────── STRINGS ─────────────────────────────────────────────
  { title: 'Valid Anagram', difficulty: 'Easy', tags: ['string','hash-table','sorting'],
    desc: 'Given two strings s and t, return true if t is an anagram of s.' },
  { title: 'Valid Palindrome', difficulty: 'Easy', tags: ['string','two-pointers'],
    desc: 'A phrase is a palindrome if it reads the same forward and backward (ignoring non-alphanumeric chars and case). Return true if the given string is a palindrome.' },
  { title: 'Reverse String', difficulty: 'Easy', tags: ['string','two-pointers','recursion'],
    desc: 'Write a function that reverses a string in place. Input is given as an array of characters.' },
  { title: 'Longest Common Prefix', difficulty: 'Easy', tags: ['string'],
    desc: 'Write a function to find the longest common prefix string amongst an array of strings. Return "" if no common prefix exists.' },
  { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', tags: ['string','hash-table','sliding-window'],
    desc: 'Given a string s, find the length of the longest substring without repeating characters.' },
  { title: 'Longest Palindromic Substring', difficulty: 'Medium', tags: ['string','dynamic-programming'],
    desc: 'Given a string s, return the longest palindromic substring in s.' },
  { title: 'Group Anagrams', difficulty: 'Medium', tags: ['string','hash-table','sorting'],
    desc: 'Given an array of strings strs, group the anagrams together. Return in any order.' },
  { title: 'String Compression', difficulty: 'Medium', tags: ['string','two-pointers'],
    desc: 'Compress the array chars in-place: replace consecutive repeating chars with char + count. Return new length.' },
  { title: 'Minimum Window Substring', difficulty: 'Hard', tags: ['string','hash-table','sliding-window'],
    desc: 'Given strings s and t, return the minimum window substring of s that contains all characters of t. Return "" if no such window exists.' },
  { title: 'Regular Expression Matching', difficulty: 'Hard', tags: ['string','dynamic-programming','recursion'],
    desc: 'Implement regular expression matching with support for . (any single char) and * (zero or more of preceding element).' },

  // ──────────── LINKED LISTS ────────────────────────────────────────
  { title: 'Reverse Linked List', difficulty: 'Easy', tags: ['linked-list','recursion'],
    desc: 'Given the head of a singly linked list, reverse the list and return the reversed list.' },
  { title: 'Merge Two Sorted Lists', difficulty: 'Easy', tags: ['linked-list','recursion'],
    desc: 'Merge two sorted linked lists and return the merged sorted list, made by splicing nodes of the two lists.' },
  { title: 'Linked List Cycle', difficulty: 'Easy', tags: ['linked-list','hash-table','two-pointers'],
    desc: 'Given head of a linked list, determine if there is a cycle using O(1) memory (Floyd\'s algorithm).' },
  { title: 'Palindrome Linked List', difficulty: 'Easy', tags: ['linked-list','recursion','two-pointers'],
    desc: 'Given head of a singly linked list, return true if it is a palindrome or false otherwise.' },
  { title: 'Remove Nth Node From End of List', difficulty: 'Medium', tags: ['linked-list','two-pointers'],
    desc: 'Given head of a linked list, remove the nth node from the end and return head.' },
  { title: 'Add Two Numbers', difficulty: 'Medium', tags: ['linked-list','math','recursion'],
    desc: 'Two non-empty linked lists represent non-negative integers (digits in reverse). Return sum as a linked list.' },
  { title: 'Reorder List', difficulty: 'Medium', tags: ['linked-list','two-pointers','stack','recursion'],
    desc: 'Reorder list L0→L1→…→Ln-1→Ln to L0→Ln→L1→Ln-1→… in-place.' },
  { title: 'LRU Cache', difficulty: 'Medium', tags: ['linked-list','hash-table','design'],
    desc: 'Design a data structure that follows LRU Cache constraints, supporting get(key) and put(key,value) in O(1).' },
  { title: 'Merge K Sorted Lists', difficulty: 'Hard', tags: ['linked-list','divide-and-conquer','heap','merge-sort'],
    desc: 'Merge k sorted linked lists and return one sorted list. Analyze and describe its complexity.' },
  { title: 'Reverse Nodes in k-Group', difficulty: 'Hard', tags: ['linked-list','recursion'],
    desc: 'Given head of a linked list, reverse the nodes of the list k at a time and return the modified list.' },

  // ──────────── TREES ───────────────────────────────────────────────
  { title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', tags: ['tree','depth-first-search','breadth-first-search'],
    desc: 'Given root of a binary tree, return its maximum depth (number of nodes along longest root-to-leaf path).' },
  { title: 'Invert Binary Tree', difficulty: 'Easy', tags: ['tree','depth-first-search','breadth-first-search'],
    desc: 'Given root of a binary tree, invert the tree and return its root.' },
  { title: 'Symmetric Tree', difficulty: 'Easy', tags: ['tree','depth-first-search','breadth-first-search'],
    desc: 'Given root of a binary tree, check whether it is a mirror of itself (symmetric around its center).' },
  { title: 'Path Sum', difficulty: 'Easy', tags: ['tree','depth-first-search','binary-tree'],
    desc: 'Given root and targetSum, return true if the tree has a root-to-leaf path such that all values along the path sum to targetSum.' },
  { title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', tags: ['tree','breadth-first-search'],
    desc: 'Given root of a binary tree, return level order traversal of its nodes\' values as a 2D array.' },
  { title: 'Validate Binary Search Tree', difficulty: 'Medium', tags: ['tree','depth-first-search','binary-search-tree'],
    desc: 'Given root of a binary tree, determine if it is a valid binary search tree (BST).' },
  { title: 'Lowest Common Ancestor of BST', difficulty: 'Medium', tags: ['tree','depth-first-search','binary-search-tree'],
    desc: 'Given a BST and two nodes p and q, find their lowest common ancestor.' },
  { title: 'Construct Binary Tree from Preorder and Inorder', difficulty: 'Medium', tags: ['tree','hash-table','divide-and-conquer'],
    desc: 'Given preorder and inorder traversals, construct and return the binary tree.' },
  { title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', tags: ['tree','dynamic-programming'],
    desc: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. Return the maximum path sum. The path can start and end at any node.' },
  { title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', tags: ['tree','depth-first-search','breadth-first-search','design'],
    desc: 'Design an algorithm to serialize a binary tree to a string and deserialize that string back into the tree. No restriction on format.' },

  // ──────────── GRAPHS ─────────────────────────────────────────────
  { title: 'Number of Islands', difficulty: 'Medium', tags: ['graph','array','depth-first-search','breadth-first-search','union-find'],
    desc: 'Given an m×n grid of \'1\'s (land) and \'0\'s (water), count the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.' },
  { title: 'Clone Graph', difficulty: 'Medium', tags: ['graph','depth-first-search','breadth-first-search','hash-table'],
    desc: 'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.' },
  { title: 'Course Schedule', difficulty: 'Medium', tags: ['graph','depth-first-search','breadth-first-search','topological-sort'],
    desc: 'Given numCourses and prerequisites, determine if you can finish all courses (detect cycle in directed graph / topological sort).' },
  { title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', tags: ['graph','array','depth-first-search','breadth-first-search'],
    desc: 'Given an m×n matrix of heights, find all cells where water can flow to both the Pacific and Atlantic oceans.' },
  { title: 'Rotting Oranges', difficulty: 'Medium', tags: ['graph','array','breadth-first-search'],
    desc: 'Given an m×n grid where 0=empty, 1=fresh, 2=rotten orange, return min minutes to rot all fresh oranges, or -1 if impossible. Rotten oranges spread each minute to 4-directional neighbors.' },
  { title: 'Walls and Gates', difficulty: 'Medium', tags: ['graph','array','breadth-first-search'],
    desc: 'Fill each empty room (INF) in a 2D grid with distance to its nearest gate. Gates=0, walls=-1, empty=INF.' },
  { title: 'Redundant Connection', difficulty: 'Medium', tags: ['graph','depth-first-search','union-find'],
    desc: 'Given a graph that started as a tree with n nodes and one additional edge, return the edge that can be removed so the result is a tree.' },
  { title: 'Word Ladder', difficulty: 'Hard', tags: ['graph','hash-table','string','breadth-first-search'],
    desc: 'Given beginWord, endWord, and wordList, return the number of words in the shortest transformation sequence from beginWord to endWord (change one letter at a time, each intermediate word must be in wordList).' },
  { title: 'Alien Dictionary', difficulty: 'Hard', tags: ['graph','topological-sort','depth-first-search'],
    desc: 'Given a list of words from an alien language sorted lexicographically, derive the order of characters in the alien alphabet. Return "" if invalid.' },
  { title: 'Network Delay Time', difficulty: 'Medium', tags: ['graph','depth-first-search','breadth-first-search','dijkstra'],
    desc: 'Given a network of n nodes and times for directed edges, find the minimum time for a signal from node k to reach all nodes. Return -1 if impossible.' },

  // ──────────── DYNAMIC PROGRAMMING ────────────────────────────────
  { title: 'Climbing Stairs', difficulty: 'Easy', tags: ['dynamic-programming','math','memoization'],
    desc: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. Return the number of distinct ways to reach the top.' },
  { title: 'House Robber', difficulty: 'Medium', tags: ['dynamic-programming','array'],
    desc: 'You are a robber; adjacent houses have alarms. Given an integer array nums representing money, return the max money you can rob without triggering alarms.' },
  { title: 'Unique Paths', difficulty: 'Medium', tags: ['dynamic-programming','math','combinatorics'],
    desc: 'A robot on an m×n grid starts at top-left. It can only move right or down. How many unique paths to reach bottom-right?' },
  { title: 'Coin Change', difficulty: 'Medium', tags: ['dynamic-programming','breadth-first-search','array'],
    desc: 'Given an array of coin denominations and amount, return the fewest number of coins to make up that amount. Return -1 if impossible.' },
  { title: 'Longest Increasing Subsequence', difficulty: 'Medium', tags: ['dynamic-programming','binary-search','array'],
    desc: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.' },
  { title: 'Word Break', difficulty: 'Medium', tags: ['dynamic-programming','trie','memoization','hash-table','string'],
    desc: 'Given a string s and dictionary wordDict, return true if s can be segmented into a space-separated sequence of dictionary words.' },
  { title: '0/1 Knapsack Problem', difficulty: 'Medium', tags: ['dynamic-programming','array'],
    desc: 'Given weights and values of n items and a knapsack capacity W, find the maximum value subset with total weight ≤ W. Each item can be picked at most once.' },
  { title: 'Edit Distance', difficulty: 'Hard', tags: ['dynamic-programming','string'],
    desc: 'Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) to convert word1 to word2.' },
  { title: 'Burst Balloons', difficulty: 'Hard', tags: ['dynamic-programming','array','divide-and-conquer'],
    desc: 'Given n balloons with nums array, burst them to maximize coins. Bursting balloon i yields nums[i-1]*nums[i]*nums[i+1].' },
  { title: 'Distinct Subsequences', difficulty: 'Hard', tags: ['dynamic-programming','string'],
    desc: 'Given strings s and t, return the number of distinct subsequences of s which equals t.' },

  // ──────────── STACK & QUEUE ───────────────────────────────────────
  { title: 'Valid Parentheses', difficulty: 'Easy', tags: ['stack','string'],
    desc: 'Given a string containing only \'(\',\')\',\'{\',\'}\',\'[\',\']\', determine if the input string is valid (open brackets closed in correct order).' },
  { title: 'Min Stack', difficulty: 'Medium', tags: ['stack','design'],
    desc: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.' },
  { title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', tags: ['stack','array','math'],
    desc: 'Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators: +, -, *, /.' },
  { title: 'Daily Temperatures', difficulty: 'Medium', tags: ['stack','array','monotonic-stack'],
    desc: 'Given an array of daily temperatures, return an array answer where answer[i] is the number of days until a warmer temperature. 0 if no such day exists.' },
  { title: 'Car Fleet', difficulty: 'Medium', tags: ['stack','array','sorting','monotonic-stack'],
    desc: 'n cars travel to target on a single-lane road. Cars that catch up form a fleet. Return number of car fleets at target.' },
  { title: 'Implement Queue Using Stacks', difficulty: 'Easy', tags: ['stack','queue','design'],
    desc: 'Implement a first-in-first-out (FIFO) queue using only two stacks, supporting push, pop, peek, and empty.' },
  { title: 'Largest Rectangle in Histogram', difficulty: 'Hard', tags: ['stack','array','monotonic-stack'],
    desc: 'Given an array of integers heights representing the histogram bar heights, find the area of the largest rectangle in the histogram.' },
  { title: 'Next Greater Element I', difficulty: 'Easy', tags: ['stack','array','hash-table','monotonic-stack'],
    desc: 'Find next greater element for each element of nums1 in nums2. Return -1 if no greater element exists.' },
  { title: 'Next Greater Element II', difficulty: 'Medium', tags: ['stack','array','monotonic-stack'],
    desc: 'Given a circular integer array nums, return the next greater number for each element (-1 if not found, wrap around).' },
  { title: 'Design Circular Queue', difficulty: 'Medium', tags: ['queue','linked-list','array','design'],
    desc: 'Design your implementation of a circular queue. Support MyCircularQueue(k), enQueue(value), deQueue(), Front(), Rear(), isEmpty(), isFull().' },

  // ──────────── SORTING & SEARCHING ────────────────────────────────
  { title: 'Binary Search', difficulty: 'Easy', tags: ['binary-search'],
    desc: 'Given a sorted array of distinct integers and a target, return its index or -1 if not found. Must run in O(log n).' },
  { title: 'Search in Rotated Sorted Array', difficulty: 'Medium', tags: ['array','binary-search'],
    desc: 'Given a rotated sorted array of distinct values and a target, return index of target or -1. Must be O(log n).' },
  { title: 'Kth Largest Element in an Array', difficulty: 'Medium', tags: ['array','divide-and-conquer','sorting','heap','quickselect'],
    desc: 'Given an integer array nums and integer k, return the kth largest element in the sorted order.' },
  { title: 'Sort Colors', difficulty: 'Medium', tags: ['array','two-pointers','sorting'],
    desc: 'Given an array with n objects colored red (0), white (1), blue (2), sort them in-place so same colors are adjacent in order 0,1,2. (Dutch National Flag)' },
  { title: 'Merge Sorted Array', difficulty: 'Easy', tags: ['array','two-pointers','sorting'],
    desc: 'Merge nums1[0..m-1] and nums2[0..n-1] into nums1 in non-decreasing order.' },
  { title: 'Search a 2D Matrix', difficulty: 'Medium', tags: ['array','binary-search','matrix'],
    desc: 'Write an efficient algorithm to search for a value target in an m×n integer matrix where rows are sorted and each row\'s first integer is greater than the last row\'s last integer.' },
  { title: 'Time Based Key-Value Store', difficulty: 'Medium', tags: ['hash-table','binary-search','string','design'],
    desc: 'Design a time-based key-value store that stores multiple values per key at different timestamps, retrievable by key and nearest past timestamp.' },
  { title: 'Median of Two Sorted Arrays', difficulty: 'Hard', tags: ['array','binary-search','divide-and-conquer'],
    desc: 'Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays. Algorithm must run in O(log(m+n)).' },
  { title: 'Find Peak Element', difficulty: 'Medium', tags: ['array','binary-search'],
    desc: 'A peak element is greater than its neighbors. Given nums, find a peak and return its index. Must run in O(log n).' },
  { title: 'Count of Smaller Numbers After Self', difficulty: 'Hard', tags: ['array','binary-search','divide-and-conquer','binary-indexed-tree','merge-sort'],
    desc: 'Given an integer array nums, return a count array where count[i] is the number of elements to the right of nums[i] smaller than it.' },

  // ──────────── MATH ────────────────────────────────────────────────
  { title: 'Palindrome Number', difficulty: 'Easy', tags: ['math'],
    desc: 'Given an integer x, return true if x is a palindrome. An integer is a palindrome when it reads the same backward as forward. Do not convert to string.' },
  { title: 'Reverse Integer', difficulty: 'Medium', tags: ['math'],
    desc: 'Given a signed 32-bit integer x, return x with its digits reversed. If reversing goes outside 32-bit range, return 0.' },
  { title: 'Count Primes', difficulty: 'Medium', tags: ['math','number-theory','sieve-of-eratosthenes'],
    desc: 'Count the number of prime numbers strictly less than n. Use Sieve of Eratosthenes for optimal performance.' },
  { title: 'Power(x, n)', difficulty: 'Medium', tags: ['math','recursion'],
    desc: 'Implement pow(x, n), which calculates x raised to the power n (i.e., x^n). Handle negative exponents.' },
  { title: 'Excel Sheet Column Number', difficulty: 'Easy', tags: ['math','string'],
    desc: 'Given a column title as it appears in an Excel sheet, return its corresponding column number (A=1, B=2, ... Z=26, AA=27, ...).' },
  { title: 'Happy Number', difficulty: 'Easy', tags: ['math','hash-table','two-pointers'],
    desc: 'A number is happy if replacing it repeatedly with the sum of squares of its digits eventually reaches 1. Return true if n is a happy number.' },
  { title: 'Integer to Roman', difficulty: 'Medium', tags: ['math','hash-table','string'],
    desc: 'Given an integer, convert it to a Roman numeral.' },
  { title: 'Factorial Trailing Zeroes', difficulty: 'Medium', tags: ['math'],
    desc: 'Given an integer n, return the number of trailing zeroes in n!. Must be O(log n).' },
  { title: 'Basic Calculator II', difficulty: 'Medium', tags: ['math','string','stack'],
    desc: 'Given a string s representing an expression with +,-,*,/ and non-negative integers, return the result. No parentheses.' },
  { title: 'Divide Two Integers', difficulty: 'Medium', tags: ['math','bit-manipulation'],
    desc: 'Divide two integers without using multiplication, division, or mod. Truncate toward zero. 32-bit overflow returns 2^31-1.' },

  // ──────────── GREEDY ──────────────────────────────────────────────
  { title: 'Jump Game', difficulty: 'Medium', tags: ['greedy','array','dynamic-programming'],
    desc: 'Given an array nums where nums[i] is your maximum jump length at position i, return true if you can reach the last index.' },
  { title: 'Jump Game II', difficulty: 'Medium', tags: ['greedy','array','dynamic-programming'],
    desc: 'Given an array nums where each value is max jump, return the minimum number of jumps to reach the last index. Guaranteed reachable.' },
  { title: 'Gas Station', difficulty: 'Medium', tags: ['greedy','array'],
    desc: 'There are n gas stations in a circle. Gas amounts and costs given. Find the starting station index to complete the circuit, or return -1.' },
  { title: 'Hand of Straights', difficulty: 'Medium', tags: ['greedy','array','hash-table','sorting'],
    desc: 'Alice divides hand of cards into groups of W consecutive cards. Return true if possible, false otherwise.' },
  { title: 'Partition Labels', difficulty: 'Medium', tags: ['greedy','hash-table','string','two-pointers'],
    desc: 'Partition string s into as many parts as possible so each letter appears in at most one part. Return a list of sizes of these parts.' },
  { title: 'Lemonade Change', difficulty: 'Easy', tags: ['greedy','array'],
    desc: 'Customers pay for $5 lemonade with $5, $10, or $20 bills. Return true if every customer can receive correct change.' },
  { title: 'Assign Cookies', difficulty: 'Easy', tags: ['greedy','array','sorting'],
    desc: 'Assign cookies to children such that child i has greed factor g[i] and cookie j has size s[j]. Maximize the number of content children.' },
  { title: 'Minimum Number of Arrows to Burst Balloons', difficulty: 'Medium', tags: ['greedy','array','sorting'],
    desc: 'Balloons are represented as horizontal intervals. Find minimum number of vertical arrows to burst all balloons.' },
  { title: 'Task Scheduler', difficulty: 'Medium', tags: ['greedy','array','hash-table','sorting','heap'],
    desc: 'Given a list of tasks (A-Z) with cooldown n, return minimum intervals to finish all tasks. Same task must wait at least n intervals.' },
  { title: 'Candy', difficulty: 'Hard', tags: ['greedy','array'],
    desc: 'n children stand in a row with ratings. Give candies satisfying: each child gets ≥1, children with higher ratings than neighbors get more. Return minimum total candies.' },
];

// ── Test case templates per problem ────────────────────────────────
function getTestCases(title, problemId) {
  const common = {
    'Two Sum':                        [['2 7 11 15\n9','0 1'],['3 2 4\n6','1 2'],['3 3\n6','0 1'],['1 2 3 4\n5','1 2'],['0 4 3 0\n0','0 3'],['1 5 7 10\n8','0 2'],['2 5 8 11\n10','1 2'],['1 3 7 9\n10','2 3'],['4 6 8 2\n10','1 2'],['7 2 13 11\n9','0 1']],
    'Valid Palindrome':               [['A man a plan a canal Panama','true'],['race a car','false'],['','true'],['Was it a car or a cat I saw','true'],['hello','false'],['No lemon no melon','true'],['12321','true'],['ab','false'],['a','true'],['Madam I\'m Adam','true']],
    'Climbing Stairs':               [['1','1'],['2','2'],['3','3'],['4','5'],['5','8'],['6','13'],['7','21'],['10','89'],['15','987'],['20','10946']],
    'Binary Search':                 [['-1 0 3 5 9 12\n9','4'],['-1 0 3 5 9 12\n2','-1'],['5\n5','0'],['1 2 3 4 5\n1','0'],['1 2 3 4 5\n5','4'],['2 4 6 8 10\n6','2'],['1 3 5 7 9\n4','-1'],['1\n1','0'],['1\n2','-1'],['1 2\n2','1']],
    'Valid Parentheses':             [['()','true'],['()[]{}','true'],['(]','false'],['([)]','false'],['{[]}','true'],['','true'],['[','false'],['{','false'],[')}','false'],['((()))','true']],
    'Reverse Linked List':           [['1 2 3 4 5','5 4 3 2 1'],['1 2','2 1'],['1','1'],['',''],['1 2 3','3 2 1'],['5 4 3 2 1','1 2 3 4 5'],['10 20','20 10'],['1 1 1','1 1 1'],['2 4 6 8','8 6 4 2'],['3 6 9','9 6 3']],
    'Maximum Depth of Binary Tree':  [['3 9 20 null null 15 7','3'],['1 null 2','2'],['','0'],['1','1'],['1 2 3','2'],['1 2 null 3 null','3'],['1 2 3 4 5','3'],['1 2 null 3 null 4 null','4'],['1 null 2 null 3','3'],['1 2 3 4 null null 5','3']],
  };
  // generic fallback: 10 simple numbered test cases
  const fallback = Array.from({length:10}, (_,i) => [`input_${i+1}`, `output_${i+1}`]);
  const cases = common[title] || fallback;
  return cases.map(([input, expected], idx) => ({
    problem_id: problemId,
    input,
    expected_output: expected,
    is_hidden: idx >= 5 ? 1 : 0,
  }));
}

// ── Main ────────────────────────────────────────────────────────────
async function seed() {
  const isConnected = await testConnection();
  if (!isConnected) { console.error('❌ DB not connected. Abort.'); process.exit(1); }

  try {
    const { rows } = await query('SELECT COUNT(*) AS total FROM problems');
    if (rows[0].total >= 50) {
      console.log(`ℹ️  Already have ${rows[0].total} problems. Skipping seed.`);
      process.exit(0);
    }

    console.log(`🌱 Seeding ${PROBLEMS.length} problems...`);
    let inserted = 0;

    for (const p of PROBLEMS) {
      const res = await query(
        'INSERT INTO problems (title, description, difficulty, tags) VALUES (?, ?, ?, ?)',
        [p.title, p.desc, p.difficulty, JSON.stringify(p.tags)]
      );
      const pid = res.rows.insertId;
      const cases = getTestCases(p.title, pid);
      for (const tc of cases) {
        await query(
          'INSERT INTO test_cases (problem_id, input, expected_output, is_hidden) VALUES (?,?,?,?)',
          [tc.problem_id, tc.input, tc.expected_output, tc.is_hidden]
        );
      }
      console.log(`  ✔ [${p.difficulty.padEnd(6)}] ${p.title}`);
      inserted++;
    }

    // Set today's daily problem to a random easy one
    const today = new Date().toISOString().slice(0, 10);
    const { rows: easy } = await query("SELECT id FROM problems WHERE difficulty='Easy' ORDER BY RAND() LIMIT 1");
    if (easy.length > 0) {
      await query('INSERT IGNORE INTO daily_problem (problem_id, date) VALUES (?,?)', [easy[0].id, today]);
      console.log(`📅 Today's daily problem set (ID ${easy[0].id})`);
    }

    console.log(`\n✅ Seeding complete! ${inserted} problems + ${inserted * 10} test cases added.\n`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
