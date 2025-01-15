# Frontend for Bank Application

This is the frontend for a bank application built using Vite, React, and Material-UI (MUI). The application allows users to register, log in, and manage their bank account, including viewing transaction summaries, depositing money, withdrawing money, and transferring funds.

## Table of Contents

- [Usage](#usage)
- [Pages](#pages)
    - [Register](#register)
    - [Login](#login)
    - [Home](#home)
    - [Deposit](#deposit)
    - [Withdraw](#withdraw)
    - [Transfer](#transfer)
- [Technologies Used](#technologies-used)

## Usage

This application is designed for managing user bank accounts. Users can perform the following actions:

1. Register for an account.
2. Log in to an existing account.
3. View a 7-day graph summary of their transactions on the Home page.
4. Deposit money into their account.
5. Withdraw money from their account.
6. Transfer money to another account.

## Pages

### Register
Allows users to create a new account by providing their details such as name, email, and password. Input validation ensures the information provided is accurate and complete.

### Login
Enables users to log in to their accounts using their registered email and password. Passwords are securely handled and not stored in plaintext.

### Home
Displays a graphical summary of the user's transactions over the past 7 days. This page helps users track their spending and deposits visually.

### Deposit
Allows users to add money to their account by specifying the deposit amount. Input validation ensures only positive amounts can be entered.

### Withdraw
Lets users withdraw money from their account. Users are notified if their account balance is insufficient to complete the withdrawal.

### Transfer
Facilitates transferring money to another user's account. Users must specify the recipient's account details and the transfer amount.

## Technologies Used

- **Vite**: A fast build tool and development server.
- **React**: A JavaScript library for building user interfaces.
- **Material-UI (MUI)**: A popular React UI framework for creating responsive and accessible components.
