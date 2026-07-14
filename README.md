# DocFlow Backend

A production-ready backend for a document editing application built with Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT authentication, and file import support.

## Features

- User Authentication
- JWT Authentication
- HTTP-only Cookies
- Document CRUD
- Rich Text storage using TipTap-compatible JSON
- File Import for .txt and .md files
- Document Sharing
- Authorization for owners and shared users
- Input validation with Zod
- Global error handling

## Tech Stack

### Frontend
- React
- JavaScript

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- PostgreSQL

### ORM
- Prisma ORM

### Authentication
- JWT
- HTTP-only cookies
- bcrypt

### Validation
- Zod

### File Upload
- Multer

### Language
- TypeScript

## Folder Structure

src/
  config/
  controllers/
  middleware/
  routes/
  services/
  validators/
  utils/
  prisma/
  app.ts
  server.ts

## Environment Variables

Create a .env file in the project root with the following values:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-secret-key"
PORT=5000
NODE_ENV="development"
```

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create your PostgreSQL database and update the DATABASE_URL value in .env.
4. Run Prisma migration:

```bash
npx prisma migrate dev --name init
```

5. Generate Prisma Client:

```bash
npx prisma generate
```

## Running the Project

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## Prisma Commands

### Create a migration

```bash
npx prisma migrate dev --name <migration-name>
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Open Prisma Studio

```bash
npx prisma studio
```

## API Documentation

### Authentication

#### Register
- Method: POST
- URL: /api/auth/register
- Authentication: No
- Body:

```json
{
  "name": "Ahmed",
  "email": "ahmed@test.com",
  "password": "123456"
}
```

Example response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "Ahmed",
      "email": "ahmed@test.com"
    }
  }
}
```

#### Login
- Method: POST
- URL: /api/auth/login
- Authentication: No
- Body:

```json
{
  "email": "ahmed@test.com",
  "password": "123456"
}
```

Example response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "Ahmed",
      "email": "ahmed@test.com"
    }
  }
}
```

#### Logout
- Method: POST
- URL: /api/auth/logout
- Authentication: Yes
- Response:

```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

### Documents

#### Create document
- Method: POST
- URL: /api/documents
- Authentication: Yes
- Body:

```json
{
  "title": "My Document",
  "content": {
    "type": "doc",
    "content": []
  }
}
```

#### List owned documents
- Method: GET
- URL: /api/documents
- Authentication: Yes

#### Get document by id
- Method: GET
- URL: /api/documents/:id
- Authentication: Yes

#### Update document
- Method: PATCH
- URL: /api/documents/:id
- Authentication: Yes
- Body:

```json
{
  "title": "Updated title",
  "content": {
    "type": "doc",
    "content": []
  }
}
```

#### Delete document
- Method: DELETE
- URL: /api/documents/:id
- Authentication: Yes

### File Import

#### Import text or markdown file
- Method: POST
- URL: /api/documents/import
- Authentication: Yes
- Form data:
  - file: .txt or .md file

### Sharing

#### Share document
- Method: POST
- URL: /api/documents/:id/share
- Authentication: Yes
- Body:

```json
{
  "email": "ali@test.com"
}
```

#### List shared documents
- Method: GET
- URL: /api/documents/shared
- Authentication: Yes

#### List users with access
- Method: GET
- URL: /api/documents/:id/shared-users
- Authentication: Yes

## Authentication Flow

Authentication uses JWTs stored in HTTP-only cookies named token. On successful login or registration, the server sets the cookie with the JWT. Protected routes read the token from the cookie first and fall back to the Authorization header for compatibility with tools such as Postman.

## Database Design

The backend uses Prisma models for:
- User
- Document
- SharedDocument

A user owns many documents, documents can be shared with other users, and shared access is represented through the SharedDocument model.

## Error Handling

The API returns a consistent JSON response format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {}
}
```

## Security

The backend includes:
- Helmet for HTTP header hardening
- CORS configuration
- Rate limiting
- Password hashing with bcrypt
- JWT validation
- HTTP-only cookies for token storage

## Future Improvements

Possible future enhancements include:
- Real-time collaboration
- Commenting and mentions
- Document version history
- Advanced rich-text features
- Email-based sharing invites

## License

MIT
