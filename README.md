# Bank Application

This repository contains both the frontend and backend for a bank application. The project is structured to provide a complete system for managing user accounts, performing transactions, and visualizing account summaries.

## Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Installation](#installation)

## Overview

This application allows users to:

1. Register and log in to their accounts.
2. View a graphical summary of transactions from the last 7 days.
3. Perform banking operations such as deposits, withdrawals, and transfers.

## Technologies Used

- **Frontend**:
    - Vite
    - React
    - Material-UI (MUI)

- **Backend**:
    - Node.js
    - Express
    - MongoDB
    - Mongoose (for MongoDB object modeling)

- **Database**:
    - MongoDB is used as the database to store user information, transactions, and account data. Mongoose is employed to manage schema definitions and interactions with the MongoDB database.

## Installation

Follow these steps to set up and run the project:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   ```
   Configure environment variables in the `.env` file as required. See [backend/README.md](./backend/README.md) for details.
   ```bash
   npm run start
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. Access the application in your browser at:
   ```
   http://localhost:5001
   ```