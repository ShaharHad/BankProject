const request = require("supertest");
const app = require("../app");
const dbConnection = require("../db_connection/db_connection");
const User = require("../db_models/account.model");

let cookie_account1;
let cookie_account2;
let cookie_account3;
let transactionCollection1;
let transactionCollection2;
let transactionCollection3;

let account1 = {
    name: "test1",
    email: "test1@gmail.com",
    password: "test1@gmail.com",
    phone: "050000000",
}

let account2 = {
    name: "test2",
    email: "test2@gmail.com",
    password: "test2@gmail.com",
    phone: "050000000",
}

let account3 = {
    name: "test3",
    email: "test3@gmail.com",
    password: "test3@gmail.com",
    phone: "050000000",
}

const money_amount = 50;

beforeAll( async () => {
    await request(app).post("/auth/register").send(account1);
    await request(app).post("/auth/register").send(account2);
    await request(app).post("/auth/register").send(account3);

    const res1 = await request(app).post("/auth/login").send(account1);
    account1 = res1.body;
    transactionCollection1 = dbConnection.collection(account1._id.toString());
    cookie_account1 = res1.headers["set-cookie"];

    const res2 = await request(app).post("/auth/login").send(account2);
    account2 = res2.body;
    transactionCollection2 = dbConnection.collection(account2._id);
    cookie_account2 = res2.headers["set-cookie"];

    const res3 = await request(app).post("/auth/login").send(account3);
    account3 = res3.body;
    transactionCollection3 = dbConnection.collection(account3._id);
    cookie_account3 = res3.headers["set-cookie"];

});

afterAll(async() => {
    try{
        await User.deleteOne({email: account1.email});
        await User.deleteOne({email: account2.email});
        await User.deleteOne({email: account3.email});
        await transactionCollection1.drop();
        await transactionCollection2.drop();
        await transactionCollection3.drop();
        await dbConnection.close(); // close db connection
    } catch(err) {
        console.error("Error during cleanup: ", err);
    }
});

describe("POST /account/transaction/payment", () => {

    test("send payment from account1 to account2", async () => {
        const send_money = {
            payment: money_amount,
            sender: "test1@gmail.com",
            receiver: "test2@gmail.com",
        }

        const receiver_amount_before = await request(app).post("/auth/login").send({
            email: "test2@gmail.com",
            password: "test2@gmail.com",
        });

        const res = await request(app)
            .post("/account/transaction/payment")
            .set("cookie", cookie_account1)
            .send(send_money)
            .expect("Content-Type", /json/)
            .expect(200);
        expect(res.body.current_balance).toBe(account1.balance - money_amount);

        const receiver_amount_after = await request(app).post("/auth/login").send({
            email: "test2@gmail.com",
            password: "test2@gmail.com",
        });
        expect(receiver_amount_after.body.balance).toBe(receiver_amount_before.body.balance + money_amount);

    }, 10000);

    test("send payment greater then balance from account1 to account2", async () => {
        const send_money = {
            payment: 1555000,
            sender: "test1@gmail.com",
            receiver: "test2@gmail.com",
        }

        const res = await request(app)
            .post("/account/transaction/payment")
            .set("cookie", cookie_account1)
            .send(send_money)
            .expect("Content-Type", /json/)
            .expect(402);
        expect(res.body.message).toBe("User dont have enough money");

    }, 10000);

    test("should get missing parameters - payment missing", async () => {

        const send_money = {
            sender: "test1@gmail.com",
            receiver: "test2@gmail.com",
        }

        const res = await request(app)
            .post("/account/transaction/payment")
            .set("cookie", cookie_account1)
            .send(send_money)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("One of parameters is empty");

    }, 10000);

    test("should get missing parameters - sender missing", async () => {

        const send_money = {
            payment: "test1@gmail.com",
            receiver: "test2@gmail.com",
        }

        const res = await request(app)
            .post("/account/transaction/payment")
            .set("cookie", cookie_account1)
            .send(send_money)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("One of parameters is empty");

    }, 10000);

    test("should get missing parameters - receiver missing", async () => {

        const send_money = {
            payment: "test1@gmail.com",
            sender: "test2@gmail.com",
        }

        const res = await request(app)
            .post("/account/transaction/payment")
            .set("cookie", cookie_account1)
            .send(send_money)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("One of parameters is empty");

    }, 10000);

    test("should get missing parameters - all missing", async () => {

        const res = await request(app)
            .post("/account/transaction/payment")
            .set("cookie", cookie_account1)
            .send({})
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("One of parameters is empty");

    }, 10000);
});


describe("POST /account/transaction/deposit", () => {

    test("success deposit", async () => {

        const account2_before = await request(app).post("/auth/login").send({
            email: account2.email,
            password: "test2@gmail.com",
        });

        const payment = {
            payment: money_amount
        }

        const res = await request(app)
            .post("/account/transaction/deposit")
            .set("cookie", cookie_account2)
            .send(payment)
            .expect("Content-Type", /json/)
            .expect(200);
        expect(account2_before.body.balance + money_amount).toBe(res.body.current_balance);

    }, 10000);

    test("should get missing parameters - payment missing", async () => {

        const res = await request(app)
            .post("/account/transaction/deposit")
            .set("cookie", cookie_account2)
            .send({})
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Payment should be exist and positive");

    }, 10000);

    test("payment is 0 - get error", async () => {

        const payment = {
            payment: 0
        }

        const res = await request(app)
            .post("/account/transaction/deposit")
            .set("cookie", cookie_account3)
            .send(payment)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Payment should be exist and positive");

    }, 10000);

    test("payment is less then 0 - get error", async () => {

        const payment = {
            payment: -256
        }

        const res = await request(app)
            .post("/account/transaction/deposit")
            .set("cookie", cookie_account3)
            .send(payment)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Payment should be exist and positive");

    }, 10000);

});

describe("POST /account/transaction/withdraw", () => {

    test("success withdraw", async () => {

        const account3_before = await request(app).post("/auth/login").send({
            email: account3.email,
            password: "test3@gmail.com",
        });

        const payment = {
            payment: money_amount
        }

        const res = await request(app)
            .post("/account/transaction/withdraw")
            .set("cookie", cookie_account3)
            .send(payment)
            .expect("Content-Type", /json/)
            .expect(200);
        expect(account3_before.body.balance - money_amount).toBe(res.body.current_balance);

    }, 10000);

    test("should get missing parameters - payment missing", async () => {

        const res = await request(app)
            .post("/account/transaction/withdraw")
            .set("cookie", cookie_account3)
            .send({})
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Payment should be exist and positive");

    }, 10000);

    test("withdraw money greater then balance", async () => {

        const payment = {
            payment: 1555333
        }

        const res = await request(app)
            .post("/account/transaction/withdraw")
            .set("cookie", cookie_account3)
            .send(payment)
            .expect("Content-Type", /json/)
            .expect(402);
        expect(res.body.message).toBe("User dont have enough money");

    }, 10000);

    test("payment is 0 - get error", async () => {

        const payment = {
            payment: 0
        }

        const res = await request(app)
            .post("/account/transaction/withdraw")
            .set("cookie", cookie_account3)
            .send(payment)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Payment should be exist and positive");

    }, 10000);

    test("payment is less then 0 - get error", async () => {

        const payment = {
            payment: -256
        }

        const res = await request(app)
            .post("/account/transaction/withdraw")
            .set("cookie", cookie_account3)
            .send(payment)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Payment should be exist and positive");

    }, 10000);
});

describe("GET /account/transaction/transactions", () => {
    test("success get all account transactions", async () => {

        let send_money = {
            payment: money_amount,
            sender: "test1@gmail.com",
            receiver: "test3@gmail.com",
        }

        await request(app)
            .post("/account/transaction/payment")
            .set("cookie", cookie_account1)
            .send(send_money)

        await request(app)
            .post("/account/transaction/payment")
            .set("cookie", cookie_account1)
            .send(send_money)

        send_money.payment = 100;

        await request(app)
            .post("/account/transaction/payment")
            .set("cookie", cookie_account1)
            .send(send_money)

        send_money = {
            payment: 15,
            sender: "test3@gmail.com",
            receiver: "test1@gmail.com",
        }

        await request(app)
            .post("/account/transaction/payment")
            .set("cookie", cookie_account3)
            .send(send_money)


        const res = await request(app)
            .get("/account/transaction/transactions")
            .set("cookie", cookie_account3)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body.transactions[0].payment).toBe(50);
        expect(res.body.transactions[0].sender).toBe(account1.email);
        expect(res.body.transactions[0].receiver).toBe(account3.email);
        expect(res.body.transactions[1].payment).toBe(50);
        expect(res.body.transactions[1].sender).toBe(account1.email);
        expect(res.body.transactions[1].receiver).toBe(account3.email);
        expect(res.body.transactions[2].payment).toBe(100);
        expect(res.body.transactions[2].sender).toBe(account1.email);
        expect(res.body.transactions[2].receiver).toBe(account3.email);
        expect(res.body.transactions[3].payment).toBe(15);
        expect(res.body.transactions[3].sender).toBe(account3.email);
        expect(res.body.transactions[3].receiver).toBe(account1.email);

    })
});



