# DSA Platform Backend

Production-ready backend for the DSA Practice Platform.

## Features
- **Node.js + Express** architecture.
- **PostgreSQL** for data persistence.
- **Judge0** integration for C++ and Java code execution.
- **Streak System** with automated updates.
- **Cron Jobs** for daily problem assignment and notifications.
- **User Progress** dashboard APIs.

## Setup

1. **Database Setup**:
   - Create a PostgreSQL database named `dsa_db`.
   - Run the schema in `src/models/schema.sql`.
   - Seed initial problems: `node src/models/seed.js`.

2. **Environment Variables**:
   - Copy `.env` and fill in your `JUDGE0_API_KEY` and database credentials.

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Running**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Problems
- `GET /api/problems`: List all problems.
- `GET /api/problems/daily`: Fetch today's challenge.

### Submissions
- `POST /api/submissions/run`: Run code against sample test cases.
- `POST /api/submissions/submit`: Submit code against hidden test cases.

### User
- `GET /api/users/:userId/stats`: Get dashboard stats.
- `GET /api/users/:userId/submissions`: Get past submissions.
