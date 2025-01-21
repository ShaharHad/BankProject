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
```

