import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/database';

console.log('Current working directory:', process.cwd());
console.log('process.env.DATABASE_URL:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 5) + '...' : 'Not set');

// Import and run the main server logic
connectDB().then(() => {
  console.log("Database connection established via index.ts");
  return import('./server');
}).then(({ startServer }) => {
  startServer();
}).catch(err => {
  console.error("Error during startup:", err);
  process.exit(1);
}); 