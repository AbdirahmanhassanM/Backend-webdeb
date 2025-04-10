import { Quiz } from '../models/Quiz.js';
import { User } from '../models/User.js';

export default async function quizRoutes(fastify, options) {
  // Authentication hook
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Get all quizzes
  fastify.get('/', async (request, reply) => {
    try {
      const quizzes = await Quiz.find().select('-correctAnswer');
      return quizzes;
    } catch (error) {
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Get quiz by ID
  fastify.get('/:id', async (request, reply) => {
    try {
      const quiz = await Quiz.findById(request.params.id).select('-correctAnswer');
      if (!quiz) {
        return reply.code(404).send({ error: 'Quiz not found' });
      }
      return quiz;
    } catch (error) {
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Submit answer
  fastify.post('/:id/submit', {
    schema: {
      body: {
        type: 'object',
        required: ['answer'],
        properties: {
          answer: { type: 'number', minimum: 0 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const quiz = await Quiz.findById(request.params.id);
      if (!quiz) {
        return reply.code(404).send({ error: 'Quiz not found' });
      }

      const isCorrect = quiz.correctAnswer === request.body.answer;
      
      if (isCorrect) {
        // Update user score
        await User.findByIdAndUpdate(request.user.userId, {
          $inc: { score: 1 }
        });
      }

      return { isCorrect };
    } catch (error) {
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Create new quiz (admin only)
  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        required: ['question', 'options', 'correctAnswer', 'category'],
        properties: {
          question: { type: 'string' },
          options: { type: 'array', items: { type: 'string' } },
          correctAnswer: { type: 'number', minimum: 0 },
          category: { type: 'string' },
          difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const quiz = new Quiz(request.body);
      await quiz.save();
      return quiz;
    } catch (error) {
      reply.code(500).send({ error: 'Internal server error' });
    }
  });
} 