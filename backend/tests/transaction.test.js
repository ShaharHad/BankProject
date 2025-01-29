const request = require("supertest");
const app = require("../app");
const dbConnection = require("../db_connection/db_connection");
const User = require("../db_models/account.model");
const jwt = require("jsonwebtoken");

const baseApi = "/api/v1"

let token_account1;
let token_account2;
let token_account3;
let token_account4;
let transactionCollection1;
let transactionCollection2;
let transactionCollection3;
let transactionCollection4;

let account1 = {
    name: "test1",
    email: "test1@gmail.com",
    password: "test1@gmail.com",
    phone: "0500000000",
}

let account2 = {
    name: "test2",
    email: "test2@gmail.com",
    password: "test2@gmail.com",
    phone: "0500000000",
}

let account3 = {
    name: "test3",
    email: "test3@gmail.com",
    password: "test3@gmail.com",
    phone: "0500000000",
}

let account4 = {
    name: "test4",
    email: "test4@gmail.com",
    password: "test4@gmail.com",
    phone: "0500000000",
}

const money_amount = 50;

beforeAll( async () => {
    await request(app).post(baseApi + "/auth/register").send(account1);
    const token1 = jwt.sign({email: account1.email}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
    await request(app).get(baseApi + "/auth/activateAccount/" + token1);

    await request(app).post(baseApi + "/auth/register").send(account2);
    const token2 = jwt.sign({email: account2.email}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
    await request(app).get(baseApi + "/auth/activateAccount/" + token2);

    await request(app).post(baseApi + "/auth/register").send(account3);
    const token3 = jwt.sign({email: account3.email}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
    await request(app).get(baseApi + "/auth/activateAccount/" + token3);

    await request(app).post(baseApi + "/auth/register").send(account4);
    const token4 = jwt.sign({email: account4.email}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
    await request(app).get(baseApi + "/auth/activateAccount/" + token4);

    const res1 = await request(app).post(baseApi + "/auth/login").send(account1);
    account1 = res1.body.account;
    transactionCollection1 = dbConnection.collection(account1._id.toString());
    token_account1 = res1.body.token;

    const res2 = await request(app).post(baseApi + "/auth/login").send(account2);
    account2 = res2.body.account;
    transactionCollection2 = dbConnection.collection(account2._id.toString());
    token_account2 = res2.body.token;

    const res3 = await request(app).post(baseApi + "/auth/login").send(account3);
    account3 = res3.body.account;
    transactionCollection3 = dbConnection.collection(account3._id.toString());
    token_account3 = res3.body.token;

    const res4 = await request(app).post(baseApi + "/auth/login").send(account4);
    account4 = res4.body.account;
    transactionCollection4 = dbConnection.collection(account4._id.toString());
    token_account4 = res4.body.token;

});

afterAll(async() => {
    try{
        await User.deleteOne({email: account1.email});
        await User.deleteOne({email: account2.email});
        await User.deleteOne({email: account3.email});
        await User.deleteOne({email: account4.email});
        await transactionCollection1.drop();
        await transactionCollection2.drop();
        await transactionCollection3.drop();
        await transactionCollection4.drop();
        await dbConnection.close(); // close db connection
    } catch(err) {
        console.error("Error during cleanup: ", err);
    }
});

describe("POST /api/v1/account/transaction/payment", () => {

    test("send payment from account1 to account2 successfully", async () => {
        const send_money = {
            amount: money_amount,
            receiver: "test2@gmail.com",
        }

        const receiver_amount_before = await request(app).post(baseApi + "/auth/login").send({
            email: "test2@gmail.com",
            password: "test2@gmail.com",
        });

        const deposit_money = 500;

        await request(app)
            .post(baseApi + "/account/transaction/deposit")
            .set("Authorization", `Bearer ${token_account1}`)
            .send({amount: deposit_money})


        const res = await request(app)
            .post(baseApi + "/account/transaction/payment")
            .set("Authorization", `Bearer ${token_account1}`)
            .send(send_money)
            .expect("Content-Type", /json/)
            .expect(200);
        expect(res.body.current_balance).toBe(deposit_money - money_amount);

        const receiver_amount_after = await request(app).post(baseApi + "/auth/login").send({
            email: "test2@gmail.com",
            password: "test2@gmail.com",
        });
        expect(receiver_amount_after.body.balance).toBe(receiver_amount_before.body.balance + money_amount);

    }, 10000);

    test("send payment greater then balance from account1 to account2", async () => {
        const send_money = {
            amount: 1555000,
            receiver: "test2@gmail.com",
        }

        const res = await request(app)
            .post(baseApi + "/account/transaction/payment")
            .set("Authorization", `Bearer ${token_account1}`)
            .send(send_money)
            .expect("Content-Type", /json/)
            .expect(402);
        expect(res.body.message).toBe("User dont have enough money");

    }, 10000);

    test("should get missing parameters - amount missing", async () => {

        const send_money = {
            receiver: "test2@gmail.com",
        }

        const res = await request(app)
            .post(baseApi + "/account/transaction/payment")
            .set("Authorization", `Bearer ${token_account1}`)
            .send(send_money)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Amount is required");

    }, 10000);


    test("should get missing parameters - receiver missing", async () => {

        const send_money = {
            amount: "test1@gmail.com",
        }

        const res = await request(app)
            .post(baseApi + "/account/transaction/payment")
            .set("Authorization", `Bearer ${token_account1}`)
            .send(send_money)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Please provide valid receiver email");

    }, 10000);

    test("should get missing parameters - all missing", async () => {

        const res = await request(app)
            .post(baseApi + "/account/transaction/payment")
            .set("Authorization", `Bearer ${token_account1}`)
            .send({})
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Please provide valid receiver email");

    }, 10000);

    test("send payment equals to 0 from account1 to account2", async () => {
        const send_money = {
            amount: 0,
            receiver: "test2@gmail.com",
        }

        const res = await request(app)
            .post(baseApi + "/account/transaction/payment")
            .set("Authorization", `Bearer ${token_account1}`)
            .send(send_money)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Amount should be greater than 0");

    }, 10000);

    test("send payment less then 0 from account1 to account2", async () => {
        const send_money = {
            amount: -56,
            receiver: "test2@gmail.com",
        }

        const res = await request(app)
            .post(baseApi + "/account/transaction/payment")
            .set("Authorization", `Bearer ${token_account1}`)
            .send(send_money)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Amount should be greater than 0");

    }, 10000);

});


describe("POST /api/account/transaction/deposit", () => {

    test("success deposit", async () => {

        const account2_before = await request(app).post(baseApi + "/auth/login").send({
            email: account2.email,
            password: "test2@gmail.com",
        });

        const payment = {
            amount: money_amount
        }

        const res = await request(app)
            .post(baseApi + "/account/transaction/deposit")
            .set("Authorization", `Bearer ${token_account2}`)
            .send(payment)
            .expect("Content-Type", /json/)
            .expect(200);
        expect(account2_before.body.balance + money_amount).toBe(res.body.current_balance);


    }, 10000);

    test("should get missing parameters - payment missing", async () => {

        const res = await request(app)
            .post(baseApi + "/account/transaction/deposit")
            .set("Authorization", `Bearer ${token_account2}`)
            .send({})
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Amount is required");

    }, 10000);

    test("payment is 0 - get error", async () => {

        const payment = {
            amount: 0
        }

        const res = await request(app)
            .post(baseApi + "/account/transaction/deposit")
            .set("Authorization", `Bearer ${token_account3}`)
            .send(payment)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Amount should be greater than 0");

    }, 10000);

    test("payment is less then 0 - get error", async () => {

        const payment = {
            amount: -256
        }

        const res = await request(app)
            .post(baseApi + "/account/transaction/deposit")
            .set("Authorization", `Bearer ${token_account3}`)
            .send(payment)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Amount should be greater than 0");

    }, 10000);

});

describe("POST /api/v1/account/transaction/withdraw", () => {

    test("success withdraw", async () => {

        await request(app)
            .post(baseApi + "/account/transaction/deposit")
            .set("Authorization", `Bearer ${token_account3}`)
            .send({amount: 500})

        const account3_before = await request(app).post(baseApi + "/auth/login").send({
            email: account3.email,
            password: "test3@gmail.com",
        });

        const payment = {
            amount: money_amount
        }

        const res = await request(app)
            .post(baseApi + "/account/transaction/withdraw")
            .set("Authorization", `Bearer ${token_account3}`)
            .send(payment)
            .expect("Content-Type", /json/)
            .expect(200);
        expect(account3_before.body.balance - money_amount).toBe(res.body.current_balance);

    }, 10000);

    test("should get missing parameters - payment missing", async () => {

        const res = await request(app)
            .post(baseApi + "/account/transaction/withdraw")
            .set("Authorization", `Bearer ${token_account3}`)
            .send({})
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Amount is required");

    }, 10000);

    test("withdraw money greater then balance", async () => {

        const payment = {
            amount: 1555333
        }

        const res = await request(app)
            .post(baseApi + "/account/transaction/withdraw")
            .set("Authorization", `Bearer ${token_account3}`)
            .send(payment)
            .expect("Content-Type", /json/)
            .expect(402);
        expect(res.body.message).toBe("User dont have enough money");

    }, 10000);

    test("payment is 0 - get error", async () => {

        const payment = {
            amount: 0
        }

        const res = await request(app)
            .post(baseApi + "/account/transaction/withdraw")
            .set("Authorization", `Bearer ${token_account3}`)
            .send(payment)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Amount should be greater than 0");

    }, 10000);

    test("payment is less then 0 - get error", async () => {

        const payment = {
            amount: -256
        }

        const res = await request(app)
            .post(baseApi + "/account/transaction/withdraw")
            .set("Authorization", `Bearer ${token_account3}`)
            .send(payment)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Amount should be greater than 0");

    }, 10000);
});

describe("GET /account/transaction/transactions", () => {
    test("success get all account transactions", async () => {

        await request(app)
            .post(baseApi + "/account/transaction/deposit")
            .set("Authorization", `Bearer ${token_account1}`)
            .send({amount: 500})

        let send_money = {
            amount: money_amount,
            sender: "test1@gmail.com",
            receiver: "test4@gmail.com",
        }

        await request(app)
            .post(baseApi + "/account/transaction/payment")
            .set("Authorization", `Bearer ${token_account1}`)
            .send(send_money)

        await request(app)
            .post(baseApi + "/account/transaction/payment")
            .set("Authorization", `Bearer ${token_account1}`)
            .send(send_money)

        send_money.amount = 100;

        await request(app)
            .post(baseApi + "/account/transaction/payment")
            .set("Authorization", `Bearer ${token_account1}`)
            .send(send_money)

        send_money = {
            amount: 15,
            sender: "test4@gmail.com",
            receiver: "test1@gmail.com",
        }

        await request(app)
            .post(baseApi + "/account/transaction/payment")
            .set("Authorization", `Bearer ${token_account4}`)
            .send(send_money)


        const res = await request(app)
            .get(baseApi + "/account/transaction/")
            .set("Authorization", `Bearer ${token_account4}`)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body[0].payment).toBe(50);
        expect(res.body[0].sender).toBe(account1.email);
        expect(res.body[0].receiver).toBe(account4.email);
        expect(res.body[1].payment).toBe(50);
        expect(res.body[1].sender).toBe(account1.email);
        expect(res.body[1].receiver).toBe(account4.email);
        expect(res.body[2].payment).toBe(100);
        expect(res.body[2].sender).toBe(account1.email);
        expect(res.body[2].receiver).toBe(account4.email);
        expect(res.body[3].payment).toBe(15);
        expect(res.body[3].sender).toBe(account4.email);
        expect(res.body[3].receiver).toBe(account1.email);

    })
});



