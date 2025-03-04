import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { scenarioRoutes } from './routes/scenario.routes';


config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', scenarioRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

const startServer = async () => {
  try {
    // Start in-memory MongoDB server
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    console.log('Connecting to in-memory MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to in-memory MongoDB successfully');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Using in-memory MongoDB for development`);
    });

    // Clean up on process termination
    process.on('SIGTERM', async () => {
      await mongoose.disconnect();
      await mongoServer.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
