const request = require("supertest");
const app = require("../app");
const dbConnection = require("../db_connection/db_connection");
const User = require("../db_models/account.model");
const jwt = require("jsonwebtoken");

let token_account1;
let token_account2;
let token_account3;
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



beforeAll( async () => {
    await request(app).post("/api/auth/register").send(account1);
    const token1 = jwt.sign({email: account1.email}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
    await request(app).get("/api/auth/activateAccount/" + token1);

    await request(app).post("/api/auth/register").send(account2);
    const token2 = jwt.sign({email: account2.email}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
    await request(app).get("/api/auth/activateAccount/" + token2);

    await request(app).post("/api/auth/register").send(account3);
    const token3 = jwt.sign({email: account3.email}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
    await request(app).get("/api/auth/activateAccount/" + token3);

    const res1 = await request(app).post("/api/auth/login").send(account1);
    account1 = res1.body.account;
    transactionCollection1 = dbConnection.collection(account1._id.toString());
    token_account1 = res1.body.token;

    const res2 = await request(app).post("/api/auth/login").send(account2);
    account2 = res2.body.account;
    transactionCollection2 = dbConnection.collection(account2._id.toString());
    token_account2 = res2.body.token;

    const res3 = await request(app).post("/api/auth/login").send(account3);
    account3 = res3.body.account;
    transactionCollection3 = dbConnection.collection(account3._id.toString());
    token_account3 = res3.body.token;
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

describe("get /account/balance", () => {
    test("success to get balance", async () => {

        const account  = await request(app)
            .get("/api/account/")
            .set("Authorization", `Bearer ${token_account2}`)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(account.body.balance).toBe(0);
        expect(account.body.name).toBe("test2");
        expect(account.body.email).toBe("test2@gmail.com");
        expect(account.body.phone).toBe("050000000");

    });
});


describe("get /api/user/balance", () => {
    test("success to get balance", async () => {
        const send_money = {
            amount: 50,
            receiver: "test2@gmail.com",
        }

        await request(app)
            .post("/api/account/transaction/deposit")
            .set("Authorization", `Bearer ${token_account1}`)
            .send({amount: 500});

        await request(app)
            .post("/api/account/transaction/payment")
            .set("Authorization", `Bearer ${token_account1}`)
            .send(send_money)
            .expect("Content-Type", /json/)
            .expect(200);

        const sender_res  = await request(app)
            .get("/api/account/balance")
            .set("Authorization", `Bearer ${token_account1}`)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(sender_res.body.balance).toBe(450);

        const receiver_res  = await request(app)
            .get("/api/account/balance")
            .set("Authorization", `Bearer ${token_account2}`)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(receiver_res.body.balance).toBe(50);

    });
});
