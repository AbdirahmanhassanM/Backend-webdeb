import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import mongoose from 'mongoose';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quiz.js';

const fastify = Fastify({
  logger: true
});

// Register plugins
await fastify.register(cors, {
  origin: config.corsOrigin
});

await fastify.register(jwt, {
  secret: config.jwtSecret
});

// Register routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(quizRoutes, { prefix: '/api/quiz' });

// Connect to MongoDB
try {
  await mongoose.connect(config.mongoUri);
  console.log('Connected to MongoDB');
} catch (error) {
  console.error('MongoDB connection error:', error);
  process.exit(1);
}

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' });
    console.log(`Server is running on port ${config.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 