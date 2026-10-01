# FlowBoard — Full Stack Life & Finance Manager

A responsive blue-themed personal organizer and P&L/cash-flow app built with React, Vite, Tailwind CSS, Redux Toolkit, Axios, Node.js, Express, MongoDB and Mongoose.

## Features
- JWT registration/login
- Monthly income, expenses, subscription spend and net cash flow dashboard
- Expense spending-by-category chart
- Personal and business transactions
- Recurring subscription manager with "Add to this month's expenses" protection against duplicate monthly charges
- Personal, Work and Business task workspaces
- Daily, weekly, monthly and one-time task categories
- Add, delete and cross off completed tasks
- Unified all-tasks view and monthly calendar
- Responsive desktop/mobile layout

## Run locally
1. Install MongoDB locally or use MongoDB Atlas.
2. Copy `server/.env.example` to `server/.env` and set `MONGO_URI` and `JWT_SECRET`.
3. Copy `client/.env.example` to `client/.env` (the default API URL works locally).
4. From the project root run:
   ```bash
   npm install
   npm run install:all
   npm run dev
   ```
5. Open `http://localhost:5173`.

The API runs on `http://localhost:5000` by default.
