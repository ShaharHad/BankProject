
const account1 = {
  email: Cypress.env("EMAIL1"),
  password: Cypress.env("PASSWORD1"),
  name: Cypress.env("NAME1"),
  phone: Cypress.env("PHONE1")
}

const account2 = {
  email: Cypress.env("EMAIL2"),
  password: Cypress.env("PASSWORD2"),
  name: Cypress.env("NAME2"),
  phone: Cypress.env("PHONE2")
}


describe('login page', () => {
  beforeEach(() => {
    cy.visit("http://localhost:5001/login");
  });

  it("should successfully login", () => {
    cy.get('[data-test="email"]').type(account1.email);
    cy.get('[data-test="password"]').type(account1.password);
    cy.get('[data-test="submit"]').click();

    cy.url().should("include", "/home");
    cy.contains("Welcome " + account1.name);

  });

  it("Error - Email not Correct", () => {
    cy.get('[data-test="email"]').type("account@email");
    cy.get('[data-test="password"]').type(account1.password);
    cy.get('[data-test="submit"]').click();

    cy.get('[data-test="errors"]').should('contain', 'Please provide valid email');

  });

  it("Error - Password not Correct", () => {
    cy.get('[data-test="email"]').type(account1.email);
    cy.get('[data-test="password"]').type("account.password");
    cy.get('[data-test="submit"]').click();

    cy.get('[data-test="errors"]').should('contain', 'Authentication failed').should('be.visible');

  });
})

describe('navbar functionality after login', () => {
  beforeEach(() => {
    cy.visit("http://localhost:5001/login");
    cy.get('[data-test="email"]').type(account1.email);
    cy.get('[data-test="password"]').type(account1.password);
    cy.get('[data-test="submit"]').click();
  });

  it("should successfully navigate to deposit page", () => {
    cy.get('[data-test="deposit"]').click();

    cy.url().should('include', '/deposit');
  });

  it("should successfully navigate to withdraw page", () => {
    cy.get('[data-test="withdraw"]').click();

    cy.url().should('include', '/withdraw');
  });

  it("should successfully navigate to transfer page", () => {
    cy.get('[data-test="transfer"]').click();

    cy.url().should('include', '/transfer');
  });

  it("should successfully navigate to transactions page", () => {
    cy.get('[data-test="transactions"]').click();

    cy.url().should('include', '/transactions');
  });

  it("should successfully navigate to home page", () => {
    cy.get('[data-test="transactions"]').click();
    cy.get('[data-test="home"]').click();

    cy.url().should('include', '/home');
  });


  it("should successfully navigate to login page - logout", () => {
    cy.get('[data-test="logout"]').click();

    cy.url().should('include', '/login');
  });

});

describe('navbar functionality before login', () => {
  beforeEach(() => {
    cy.visit("http://localhost:5001");
  });

  it("should successfully navigate to register page", () => {
    cy.get('[data-test="register"]').click();

    cy.url().should('include', '/register');
  })

  it("should successfully navigate to login page", () => {
    cy.get('[data-test="register"]').click();
    cy.get('[data-test="login"]').click();
    cy.url().should('include', '/login');
  })

});

describe('deposit page', () => {

  beforeEach(() => {
    cy.visit("http://localhost:5001/login");
    cy.get('[data-test="email"]').type(account1.email);
    cy.get('[data-test="password"]').type(account1.password);
    cy.get('[data-test="submit"]').click();
    cy.get('[data-test="deposit"]').click();
    cy.get('[data-test="amount"]').clear();
  });

  it("should successfully deposit", () => {
    cy.get('[data-test="amount"]').type(100);
    cy.get('[data-test="submit"]').click();

    cy.contains('Deposit success').should('be.visible');
  });

  it("Error - Deposit amount smaller then 0", () => {
    cy.get('[data-test="amount"]').type(-50);
    cy.get('[data-test="submit"]').click();

    cy.contains('Amount should be greater than 0').should('be.visible');
  });

  it("Error - Deposit amount equal to 0", () => {
    cy.get('[data-test="amount"]').type(0);
    cy.get('[data-test="submit"]').click();

    cy.contains('Amount should be greater than 0').should('be.visible');
  });
})

describe('withdraw page', () => {
  beforeEach(() => {
    cy.visit("http://localhost:5001/login");
    cy.get('[data-test="email"]').type(account1.email);
    cy.get('[data-test="password"]').type(account1.password);
    cy.get('[data-test="submit"]').click();
    cy.get('[data-test="withdraw"]').click();
    cy.get('[data-test="amount"]').clear();
  });

  it("should successfully withdraw", () => {
    cy.get('[data-test="amount"]').type(50);
    cy.get('[data-test="submit"]').click();

    cy.contains('Withdraw success').should('be.visible');
  });

  it("Error - Withdraw amount smaller then 0", () => {
    cy.get('[data-test="amount"]').type(-50);
    cy.get('[data-test="submit"]').click();

    cy.contains('Amount should be greater than 0').should('be.visible');
  });

  it("Error - Withdraw amount equal to 0", () => {
    cy.get('[data-test="amount"]').type(0);
    cy.get('[data-test="submit"]').click();

    cy.contains('Amount should be greater than 0').should('be.visible');
  });
})

describe('transfer page', () => {
  beforeEach(() => {
    cy.visit("http://localhost:5001/login");
    cy.get('[data-test="email"]').type(account1.email);
    cy.get('[data-test="password"]').type(account1.password);
    cy.get('[data-test="submit"]').click();
    cy.get('[data-test="transfer"]').click();
    cy.get('[data-test="amount"]').clear();
  });

  it("should successfully transfer from account1 to account2", () => {
    cy.get('[data-test="amount"]').type(50);
    cy.get('[data-test="receiver"]').type(account2.email);
    cy.get('[data-test="submit"]').click();

    cy.contains('Payment transfer success').should('be.visible');
  });

  it("should successfully transfer from account2 to account1", () => {
    cy.get('[data-test="logout"]').click();
    cy.visit("http://localhost:5001/login");
    cy.get('[data-test="email"]').type(account2.email);
    cy.get('[data-test="password"]').type(account2.password);
    cy.get('[data-test="submit"]').click();
    cy.wait(5);
    cy.get('[data-test="transfer"]').click();
    cy.get('[data-test="amount"]').clear();

    cy.get('[data-test="amount"]').type(50);
    cy.get('[data-test="receiver"]').type(account1.email);
    cy.get('[data-test="submit"]').click();

    cy.contains('Payment transfer success').should('be.visible');
  });

  it("Error - Withdraw amount smaller then 0", () => {
    cy.get('[data-test="amount"]').type(-50);
    cy.get('[data-test="receiver"]').type(account2.email);
    cy.get('[data-test="submit"]').click();

    cy.contains('Amount should be greater than 0').should('be.visible');
  });

  it("Error - Withdraw amount equal to 0", () => {
    cy.get('[data-test="amount"]').type(0);
    cy.get('[data-test="receiver"]').type(account2.email);
    cy.get('[data-test="submit"]').click();

    cy.contains('Amount should be greater than 0').should('be.visible');
  });
})


