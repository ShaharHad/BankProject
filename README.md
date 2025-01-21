# Bank Application

This repository contains both the frontend and backend for a bank application. The project is structured to provide a complete system for managing user accounts, performing transactions, and visualizing account summaries.

## Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Password Security](#password-security)
- [Account verification](#account-verification)
- [Authentication](#authentication)
- [Installation](#installation)


## Overview

This application allows users to:

1. Register and log in to their accounts.
2. View a graphical summary of transactions from the last 7 days.
3. Perform banking operations such as deposits, withdrawals, and transfers.
4. View all transactions they send or get.

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

## Password Security

The backend uses bcrypt to securely hash user passwords before storing them in the database. This ensures that even if the database is compromised, the original passwords cannot be easily retrieved. During authentication, bcrypt is also used to compare the hashed password with the user-provided password.

## Account verification
The system send verification email to user after successful registration and only when the user click on the verification link in its mail he can login to system

## Authentication

The system uses Bearer Tokens for secure communication between the frontend and backend. After a successful login, a JWT token is issued to the client, which must be included in the Authorization header of subsequent API requests:
   ```bash
   Authorization: Bearer <token>
   ```
This ensures that only authenticated users can access protected endpoints.

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