# Bank Application - Main README

This repository contains a complete bank application consisting of a frontend and a backend, both housed in separate folders within the `app` directory. The frontend and backend work together to provide a full-stack application for managing user bank accounts.

## Table of Contents


- [Setup](#setup)
- [Frontend](#frontend)
- [Backend](#backend)

## Setup

To set up the entire project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo/app
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   npm run start
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. Access the application:
    - Frontend: Open [http://localhost:3000](http://localhost:3000) in your browser.
    - Backend: The API server will be running on [http://localhost:5001](http://localhost:5001) (or the port specified in your backend configuration).

## Frontend

The frontend is built with:

- **Vite**: For fast builds and hot module replacement.
- **React**: For building user interfaces.
- **Material-UI (MUI)**: For consistent and responsive design.

For more details, see the [frontend README](./frontend/README.md).

## Backend

The backend is built with:

- **Node.js**: For the runtime environment for javascript.
- **Express**: For handling HTTP requests and APIs.

For more details, see the [backend README](./backend/README.md).

