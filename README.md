

# Google Forms Lite Clone

## Description
Google Forms Lite Clone is a monorepo application for creating forms, filling them out, and viewing submitted responses.

The project contains:
- `client/` — Front-end built with React, TypeScript, Redux Toolkit, and RTK Query
- `server/` — Back-end built with Node.js, GraphQL, and in-memory storage

---

## Tech Stack
### Front-end
- React
- TypeScript
- Redux Toolkit
- RTK Query
- React Router

### Back-end
- Node.js
- Express
- GraphQL
- In-memory storage

---

## Project Structure
```text
google-forms-lite-clone/
	client/
	server/
```

---

## Installation
1. Clone the repository
```bash
git clone https://github.com/Grihorak-Bogdan/google-forms-lite-clone.git
cd google-forms-lite-clone
```
2. Install root dependencies
```bash
npm install
```
3. Install client dependencies
```bash
cd client
npm install
cd ..
```
4. Install server dependencies
```bash
cd server
npm install
cd ..
```

---

## Running the project
Start client and server together:
```bash
npm start
```

### Available URLs
- **Client:** http://localhost:3000
- **GraphQL API:** http://localhost:4000/graphql
- **GraphQL GUI:** http://localhost:4000/gui

---

## Available Features
- Create new forms
- Add questions with different types: Text, Multiple Choice, Checkbox, Date
- Fill out forms
- Submit responses
- View submitted responses
- GraphQL API integration with RTK Query
- In-memory data storage

---

## Application Routes
- `/` — forms list
- `/forms/new` — create a new form
- `/forms/:id/fill` — fill out a form
- `/forms/:id/responses` — view form responses

---

## GraphQL Operations
### Queries
- `forms`
- `form(id: ID!)`
- `responses(formId: ID!)`

### Mutations
- `createForm(...)`
- `submitResponse(...)`
- `updateForm(...)`
- `deleteForm(...)`

---

## Important Note
This project uses in-memory storage, so all forms and responses are removed after restarting the server.

---

## Testing
Default test setup from Create React App is available.

To run tests:
```bash
npm test
```

---

## Author
Bohdan Hryhoriak
