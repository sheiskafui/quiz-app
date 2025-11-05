# Quiz App — Backend (Node.js + Express + MongoDB)

A modern, secure backend for a quiz application built with Node.js, Express, and MongoDB (Mongoose). Focused on email-based authentication, email verification, access and refresh tokens, protected routes, and a foundation for quiz management.

## Project overview
A minimal but production-minded backend providing:

- Email-based user registration and login with password hashing
- Email verification workflow
- Short-lived access tokens and long-lived refresh tokens
- Token revocation (logout) and protected routes middleware
- Starter endpoints for quiz features to extend

## Key Features

- Authentication: register, login, email verify, refresh, logout
- Security: bcrypt password hashing, JWT tokens, verification tokens
- Persistence: MongoDB via Mongoose
- Email: verification emails (nodemailer)
- Extensible structure: controllers, routes, models, middleware, utils

## Tech Stack

- Node.js (LTS)
- Express
- mysql/sequelize
- bcrypt
- jsonwebtoken
- nodemailer
- dotenv

## API ENDPOINTS

Base path: /api/auth
- POST /api/auth/register
    - Register a new user; sends verification email.
    - Body: { "email": "user@example.com", "password": "pass" }
- GET /api/auth/verify/:token
    - Verify email using token in link.
- POST /api/auth/login
    - Authenticate verified user; returns { accessToken, refreshToken }.
    - Body: { "email": "...", "password": "..." }
- POST /api/auth/refresh
    - Exchange refresh token for a new access token.
    - Body: { "refreshToken": "..." }
- POST /api/auth/logout
    - Revoke refresh token (requires Authorization bearer access token).


## Testing
- Unit and integration tests (Jest).







