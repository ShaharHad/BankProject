# Bank API

This repository provides a backend server for a banking application. The API supports basic banking operations such as user authentication, deposits, withdrawals, and transfers.

## Features

1. **User Authentication**:
    - Login
    - Register
2. **Banking Operations**:
    - Deposit
    - Withdraw
    - Transfer

---

## API Endpoints

### Authentication

#### 1. **Login**
- **Endpoint**: `/api/auth/login`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - **200 OK**
    ```json
    {
      "token": "string",
      "account": "object",
      "balance": "number"
    }
    ```

  - **400 Fail**
    ```json
    {
      "message": "One of parameters is empty"
    }
    ```

  - **401 Fail**
    ```json
    {
      "message": "Authentication failed"
    }
    ```

  - **500 Fail**
    ```json
    {
      "message": "Server error"
    }
    ```

#### 2. **Register**
- **Endpoint**: `/api/auth/register`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string",
    "email": "string",
    "phone": "string"
  }
  ```
- **Response**:
  - **200 OK**
    ```json
    {
      "message": "Successfully created account"
    }
    ```

  - **400 Fail**
    ```json
    {
      "message": "One of parameters is empty"
    }
    ```

  - **409 Fail**
    ```json
    {
      "message": "Duplicate account"
    }
    ```

  - **500 Fail**
    ```json
    {
      "message": "Fail to create account"
    }
    ```
    #### 2. **Register**
- **Endpoint**: `/api/auth/register`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string",
    "email": "string",
    "phone": "string"
  }
  ```
- **Response**:
  - **HTML page**
    - Success: Activation success
    - failure: Already activate or error page

---

### Banking Operations

#### 3. **Deposit**
- **Endpoint**: `/api/account/transaction/deposit`
- **Method**: POST
- **Request Body**:
    ```json
    {
      "amount": "number"
    }
    ``` 
- **Response**:
  - **200 OK**
    ```json
    {
      "balance": "number"
    }
    ```

  - **400 Fail**
    ```json
    {
      "message": "One of parameters is empty"
    }
    ```

  - **402 Fail**
    ```json
    {
      "message": "User dont have enough money / Amount should be positive and greater then 0"
    }
    ```

  - **500 Fail**
    ```json
    {
      "message": "Couldn't complete the deposit operation"
    }
    ```

#### 4. **Withdraw**
- **Endpoint**: `/api/account/transaction/withdraw`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "amount": "number"
  }
  ```
- **Response**:
  - **200 OK**
    ```json
    {
      "balance": "number"
    }
    ```

  - **400 Fail**
    ```json
    {
      "message": "One of parameters is empty"
    }
    ```

  - **402 Fail**
    ```json
    {
      "message": "User dont have enough money / Amount should be positive and greater then 0"
    }
    ```

  - **500 Fail**
    ```json
    {
      "message": "Couldn't complete the withdraw operation"
    }
    ```

#### 5. **Transfer**
- **Endpoint**: `/api/account/transaction/transfer`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "amount": "number",
    "receiver": "string"
  }
  ```
- **Response**:
  - **200 OK**
    ```json
    {
      "balance": "number"
    }
    ```

  - **400 Fail**
    ```json
    {
      "message": "One of parameters is empty"
    }
    ```

  - **402 Fail**
    ```json
    {
      "message": "User dont have enough money / Amount should be positive and greater then 0"
    }
    ```

  - **404 Fail**
    ```json
    {
      "message": "Receiver don't exist"
    }
    ```

  - **500 Fail**
    ```json
    {
      "message": "Couldn't complete the transaction"
    }
    ```

#### 5. **get transaction**
- **Endpoint**: `/api/account/transaction/`
- **Method**: GET

- **Response**:
  - **200 OK**
    ```json
    {
      "transactions": "object"
    }
    ```

  - **500 Fail**
    ```json
    {
      "message": "server error"
    }
    ```

---

## Environment Variables

Ensure to set up the following environment variables in a `.env` file 
before run the server:

```env
PORT=your_port
DB_URI=your_database_connection_string
TOKEN_SECRET=your_jwt_secret
SALT=your_salt_for_bcrypt

CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REDIRECT_URI=your_redirect_uri
EMAIL_SENDER=your_email_sender
REFRESH_TOKEN=your_gmail_refresh_token

```

## Technologies and libraries Used

- **node js**: A framework to run javascript.
- **express**: A web application framework that provides methods for routing, middlewares and handling HTTP requests and response.
- **jsonwebtoken**: Handles JSON Web Tokens (JWT) for authentication.
- **express-validator**: Provides validation and sanitization middleware for Express.
- **bcryptjs**: Provides hashing and salting functionalities for passwords.
- **cors**: Enables Cross-Origin Resource Sharing (CORS).
- **dotenv**: Loads environment variables from a .env file into process.env.
- **googleapis**: Provides access to Google's APIs (used for access to gmail api) 
- **mongoose**: An Object Data Modeling (ODM) library for MongoDB
- **morgan**: HTTP request logger middleware for Express.
- **winston**: A logging library for Node.js
- **socket.io**: Enables real-time, bidirectional communication between server and client
- **nodemailer**: Sends emails from Node.js applications
- **jest**: JavaScript testing framework
- **supertest**: HTTP assertions library for testing APIs