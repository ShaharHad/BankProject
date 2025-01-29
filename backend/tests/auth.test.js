const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const dbConnection = require("../db_connection/db_connection");
const User = require("../db_models/account.model");

const baseApi = "/api/v1"

let accountCollection1;
let accountCollection2;
let accountCollection3;
let accountCollection4;

const account1 = {
    name: "test1",
    email: "test1@gmail.com",
    password: "test1@gmail.com",
    phone: "0500000000",
}

const account2 = {
    name: "test2",
    email: "test2@gmail.com",
    password: "test2@gmail.com",
    phone: "0500000000",
}

const account3 = {
    name: "test3",
    email: "test3@gmail.com",
    password: "test3@gmail.com",
    phone: "0500000000",
}

const account4 = {
    name: "test4",
    email: "test4@gmail.com",
    password: "test4@gmail.com",
    phone: "0500000000",
}

beforeAll(() => {

});

afterAll(async() => {
    try{
        await User.deleteOne({email: account1.email});
        await User.deleteOne({email: account2.email});
        await User.deleteOne({email: account3.email});
        await accountCollection1.drop();
        await accountCollection2.drop();
        await accountCollection3.drop();

        const token = jwt.sign({email: account4.email}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
        await request(app).get(baseApi + "/auth/activateAccount/" + token);
        const res = await request(app).post(baseApi + "/auth/login").send(account4);
        accountCollection4 = dbConnection.collection(res.body.account._id.toString());

        await User.deleteOne({email: account4.email});
        await accountCollection4.drop();

        await dbConnection.close(); // close db connection
    } catch(err) {
        console.log(err);
    }
});

describe("POST /api/auth/register", () => {
    test("register account1 successfully", async () => {
        const res = await request(app)
            .post(baseApi + "/auth/register")
            .send(account1)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body.message).toBe("Successfully created account");

    }, 10000);

    test("account1 activated successfully", async () => {
        const token = jwt.sign({email: account1.email}, process.env.TOKEN_SECRET, {expiresIn: '1h'});

        await request(app)
            .get(baseApi + "/auth/activateAccount/" + token)
            .expect("Content-Type", "text/html; charset=utf-8")
            .expect(200);
    }, 10000);


    test("register account2 successfully", async () => {
        const res = await request(app)
            .post(baseApi + "/auth/register")
            .send(account2)
            .expect("Content-Type", /json/)
            .expect(200);
        expect(res.body.message).toBe("Successfully created account");
    }, 10000);

    test("account2 activated successfully", async () => {
        const token = jwt.sign({email: account2.email}, process.env.TOKEN_SECRET, {expiresIn: '1h'});

        await request(app)
            .get(baseApi + "/auth/activateAccount/" + token)
            .expect("Content-Type", "text/html; charset=utf-8")
            .expect(200);

    }, 10000);

    test("register account3 successfully", async () => {
        const res = await request(app)
            .post(baseApi + "/auth/register")
            .send(account3)
            .expect("Content-Type", /json/)
            .expect(200);
        expect(res.body.message).toBe("Successfully created account");
    }, 10000);

    test("account3 activated successfully", async () => {
        const token = jwt.sign({email: account3.email}, process.env.TOKEN_SECRET, {expiresIn: '1h'});

        await request(app)
            .get(baseApi + "/auth/activateAccount/" + token)
            .expect("Content-Type", "text/html; charset=utf-8")
            .expect(200);

    }, 10000);

    test("register account4 successfully", async () => {
        const res = await request(app)
            .post(baseApi + "/auth/register")
            .send(account4)
            .expect("Content-Type", /json/)
            .expect(200);
        expect(res.body.message).toBe("Successfully created account");
    }, 10000);


    test("duplicate error", async () => {
        const res = await request(app)
            .post(baseApi + "/auth/register")
            .send(account1)
            .expect("Content-Type", /json/)
            .expect(409);
        expect(res.body.message).toBe("Duplicate account");

    }, 10000);

    test("missing parameters - email missing", async () => {
        const {email, ...account} = account1;
        const res = await request(app)
            .post(baseApi + "/auth/register")
            .send(account)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Please provide valid email");

    }, 10000);

    test("missing parameters - password missing", async () => {
        const {password, ...account} = account1;
        const res = await request(app)
            .post(baseApi + "/auth/register")
            .send(account)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Password is required");

    }, 10000);

    test("missing parameters - name missing", async () => {
        const {name, ...account} = account1;
        const res = await request(app)
            .post(baseApi + "/auth/register")
            .send(account)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Name is required");

    }, 10000);

    test("missing parameters - phone missing", async () => {
        const {phone, ...account} = account1;
        const res = await request(app)
            .post(baseApi + "/auth/register")
            .send(account)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Phone number should be string");

    }, 10000);

});


describe("POST /api/v1/auth/login", () => {

    test("should return the account1 info ", async () => {
        const res = await request(app)
            .post(baseApi + "/auth/login")
            .send(account1)
            .expect("Content-Type", /json/)
            .expect(200);
        accountCollection1 = dbConnection.collection(res.body.account._id.toString());
        const {password, ...account} = account1;
        expect(res.body.account).toEqual(
            expect.objectContaining(account)
        );
        expect(res.body.token).not.toBeNull();
        expect(res.body.balance).not.toBeNull();
    }, 10000);

    test("should return the account2 info ", async () => {
        const res = await request(app)
            .post(baseApi + "/auth/login")
            .send(account2)
            .expect("Content-Type", /json/)
            .expect(200);
        accountCollection2= dbConnection.collection(res.body.account._id.toString());
        const {password, ...account} = account2;
        expect(res.body.account).toEqual(
            expect.objectContaining(account)
        );
    }, 10000);

    test("should return the account3 info ", async () => {
        const res = await request(app)
            .post(baseApi + "/auth/login")
            .send(account3)
            .expect("Content-Type", /json/)
            .expect(200);
        accountCollection3 = dbConnection.collection(res.body.account._id.toString());
        const {password, ...account} = account3;
        expect(res.body.account).toEqual(
            expect.objectContaining(account)
        );
    }, 10000);

    test("account4 not activated", async () => {
        await request(app)
            .post(baseApi + "/auth/login")
            .send(account4)
            .expect("Content-Type", /json/)
            .expect(401);

    }, 10000);

    test("should return error missing parameter - email missing ", async () => {
        const login_data = {
            password: "test1@gmail.com"
        }
        const res = await request(app)
            .post(baseApi + "/auth/login")
            .send(login_data)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("Please provide valid email");
    }, 10000);

    test("should return error missing parameter - password missing ", async () => {
        const login_data = {
            email: "test1@gmail.com"
        }
        const res = await request(app)
            .post(baseApi + "/auth/login")
            .send(login_data)
            .expect("Content-Type", /json/)
            .expect(400);

        expect(res.body.message).toBe("Password is required");
    }, 10000);

    test("should return error missing parameters - body missing ", async () => {
        const res = await request(app)
            .post(baseApi + "/auth/login")
            .send({})
            .expect("Content-Type", /json/)
            .expect(400);

        expect(res.body.message).toBe("Please provide valid email");
    }, 10000);

    test("should return error not found account", async () => {
        const login_data = {
            email: "shahar123@gmail.com",
            password: "test1@gmail.com"
        }
        const res = await request(app)
            .post(baseApi + "/auth/login")
            .send(login_data)
            .expect("Content-Type", /json/)
            .expect(404);

        expect(res.body.message).toBe("Account not found");
    }, 10000);

    test("should return authentication failed", async () => {
        const login_data = {
            email: "test1@gmail.com",
            password: "asfsafddas"
        }
        const res = await request(app)
            .post(baseApi + "/auth/login")
            .send(login_data)
            .expect("Content-Type", /json/)
            .expect(401);

        expect(res.body.message).toBe("Authentication failed");
    }, 10000);

});

