# Task Manager Application

This is a **Full-Stack Task Manager** web application built with **Next.js 15** and **TypeScript**, following modern best practices for secure, scalable, and user-friendly web development. The project is part of a Fullstack Developer Assignment.

## Live Demo

Check the live application here: [Task Manager Live](https://task-manager-ten-tawny.vercel.app)

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Database Setup](#database-setup)
- [Future Improvements](#future-improvements)
- [Author](#author)

---

## Project Overview

The Task Manager app allows users to create, read, update, and delete tasks for efficient task tracking. It demonstrates modern full-stack development using **Next.js 15**, **Tailwind CSS**, and **PostgreSQL**. The application is responsive, accessible, and optimized for performance.

---

## Features

### Mandatory Features
- **CRUD Functionality**: Create, read, update, delete tasks.
- **Responsive UI**: Clean and intuitive interface using Tailwind CSS.
- **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)** for optimized performance.
- **Database Integration**: PostgreSQL used to store tasks securely.
- **Data Validation & Sanitization** to ensure security.

### Optional Features (Not implemented)
- AI Features (like predictive insights or auto-generated summaries)
- Authentication & Authorization
- Testing (unit, integration, and end-to-end)
- Advanced security features

---

## Technology Stack

- **Frontend & Backend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: PostgreSQL (via Prisma ORM)
- **Version Control**: Git, GitHub
- **Deployment**: Vercel

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/JevaneswariK/task-manager.git
cd task-manager
2. Install dependencies
bash
Copy code
npm install
# or
yarn install
3. Set up environment variables
Create a .env file in the root directory:

env
Copy code
DATABASE_URL=your_database_connection_string
4. Run the development server
bash
Copy code
npm run dev
# or
yarn dev
Open http://localhost:3000 in your browser.

Folder Structure
bash
Copy code
/app
  /api
    /tasks/route.ts      # CRUD API endpoints
  /components
  /page.tsx
/prisma
  schema.prisma           # Database schema
/public
  /icons, /images
/styles
  globals.css
Database Setup
This project uses PostgreSQL. Prisma is used as an ORM for type-safe queries.

Configure your database connection in .env.

Run migrations:

bash
Copy code
npx prisma migrate dev
Prisma automatically generates types for TypeScript.

Future Improvements
Implement Authentication & Authorization (e.g., NextAuth.js).

Add unit and integration tests.

Integrate AI-based features like task summaries or reminders.

Add advanced security measures (JWT, encryption).

Author
Name: K Jevaneswari

GitHub: https://github.com/JevaneswariK

LinkedIn: https://www.linkedin.com/in/jevaneswari-k-937a312a0/


