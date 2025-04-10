import { User } from '../models/User.js';

export default async function authRoutes(fastify, options) {
  // Signup route
  fastify.post('/signup', {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', minLength: 3 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { username, email, password } = request.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return reply.code(400).send({ error: 'Username or email already exists' });
      }

      // Create new user
      const user = new User({ username, email, password });
      await user.save();

      // Generate JWT token
      const token = fastify.jwt.sign({ userId: user._id });

      return { token };
    } catch (error) {
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Login route
  fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { email, password } = request.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      // Check password
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = fastify.jwt.sign({ userId: user._id });

      return { token };
    } catch (error) {
      reply.code(500).send({ error: 'Internal server error' });
    }
  });
} 