# Are You Dumb? - Backend

This is the backend service for the "Are You Dumb?" quiz application. It provides a RESTful API for user authentication and quiz management.

## Features

- User authentication (signup/login) with JWT
- Quiz management (create, read, submit answers)
- Score tracking
- MongoDB integration
- Secure password hashing
- CORS enabled

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
4. Update the following environment variables in `.env`:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure secret key for JWT tokens
   - `CORS_ORIGIN`: The URL of your frontend application

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/login` - Login user

### Quiz
- GET `/api/quiz` - Get all quizzes
- GET `/api/quiz/:id` - Get quiz by ID
- POST `/api/quiz/:id/submit` - Submit quiz answer
- POST `/api/quiz` - Create new quiz (admin only)

## Security

- Passwords are hashed using bcrypt
- JWT authentication for protected routes
- CORS protection
- Input validation using JSON Schema
- MongoDB injection protection through Mongoose

## Error Handling

The API uses standard HTTP status codes and returns JSON responses with error messages when something goes wrong. 