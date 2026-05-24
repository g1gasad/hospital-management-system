import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { initializePool, closePool } from './config/database.js';
import { initializeTables, insertSampleData } from './config/initDatabase.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// API routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Startup function
async function startServer() {
  try {
    console.log('\n========================================');
    console.log('Hospital Management System - Backend');
    console.log('========================================\n');

    // Initialize database
    console.log('Initializing Oracle Database Connection...');
    await initializePool();

    // Create tables and insert sample data
    console.log('Setting up database tables...');
    await initializeTables();
    
    console.log('Inserting sample data...');
    await insertSampleData();

    // Start server
    app.listen(PORT, () => {
      console.log(`\n✓ Server running on http://localhost:${PORT}`);
      console.log('\nAvailable Endpoints:');
      console.log('  GET  /api/health');
      console.log('  GET  /api/patients');
      console.log('  GET  /api/doctors');
      console.log('  GET  /api/appointments');
      console.log('  GET  /api/medical-records');
      console.log('  GET  /api/departments');
      console.log('\n========================================\n');
    });
  } catch (err) {
    console.error('✗ Failed to start server:', err.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await closePool();
  process.exit(0);
});

// Start the server
startServer();
