const request = require("supertest");
const app = require("../app");
const dbConnection = require("../db_connection/db_connection");
const User = require("../db_models/account.model");

let accountCollection1;
let accountCollection2;
let accountCollection3;

const account1 = {
    name: "shahar1",
    email: "shahar1@gmail.com",
    password: "shahar1@gmail.com",
    phone: "050000000",
}

const account2 = {
    name: "shahar2",
    email: "shahar2@gmail.com",
    password: "shahar2@gmail.com",
    phone: "050000000",
}

const account3 = {
    name: "shahar3",
    email: "shahar3@gmail.com",
    password: "shahar3@gmail.com",
    phone: "050000000",
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
        await dbConnection.close(); // close db connection
    } catch(err) {
        console.log(err);
    }
});

describe("POST /auth/register", () => {
    test("register account1 successfully", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send(account1)
            .expect("Content-Type", /json/)
            .expect(200);
        expect(res.body.message).toBe("Successfully created account");
    }, 10000);

    test("register account2 successfully", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send(account2)
            .expect("Content-Type", /json/)
            .expect(200);
        expect(res.body.message).toBe("Successfully created account");
    }, 10000);

    test("register account3 successfully", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send(account3)
            .expect("Content-Type", /json/)
            .expect(200);
        expect(res.body.message).toBe("Successfully created account");
    }, 10000);

    test("should get duplicate error", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send(account1)
            .expect("Content-Type", /json/)
            .expect(409);
        expect(res.body.message).toBe("Duplicate account");

    }, 10000);

    test("should get missing parameters - email missing", async () => {
        const {email, ...account} = account1;
        const res = await request(app)
            .post("/auth/register")
            .send(account)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("One of parameters is empty");

    }, 10000);

    test("should get missing parameters - password missing", async () => {
        const {password, ...account} = account1;
        const res = await request(app)
            .post("/auth/register")
            .send(account)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("One of parameters is empty");

    }, 10000);

    test("should get missing parameters - name missing", async () => {
        const {name, ...account} = account1;
        const res = await request(app)
            .post("/auth/register")
            .send(account)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("One of parameters is empty");

    }, 10000);

    test("should get missing parameters - phone missing", async () => {
        const {phone, ...account} = account1;
        const res = await request(app)
            .post("/auth/register")
            .send(account)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("One of parameters is empty");

    }, 10000);

});


describe("POST /auth/login", () => {
    test("should return the account1 info ", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send(account1)
            .expect("Content-Type", /json/)
            .expect(200);
        accountCollection1 = dbConnection.collection(res.body._id.toString());
        const {password, ...account} = account1;
        expect(res.body).toEqual(
            expect.objectContaining(account)
        );
    }, 10000);

    test("should return the account2 info ", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send(account2)
            .expect("Content-Type", /json/)
            .expect(200);
        accountCollection2= dbConnection.collection(res.body._id.toString());
        const {password, ...account} = account2;
        expect(res.body).toEqual(
            expect.objectContaining(account)
        );
    }, 10000);

    test("should return the account3 info ", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send(account3)
            .expect("Content-Type", /json/)
            .expect(200);
        accountCollection3 = dbConnection.collection(res.body._id.toString());
        const {password, ...account} = account3;
        expect(res.body).toEqual(
            expect.objectContaining(account)
        );
    }, 10000);

    test("should return error missing parameter - email missing ", async () => {
        const login_data = {
            password: "shahar1@gmail.com"
        }
        const res = await request(app)
            .post("/auth/login")
            .send(login_data)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body.message).toBe("One of parameters is empty");
    }, 10000);

    test("should return error missing parameter - password missing ", async () => {
        const login_data = {
            email: "shahar1@gmail.com"
        }
        const res = await request(app)
            .post("/auth/login")
            .send(login_data)
            .expect("Content-Type", /json/)
            .expect(400);

        expect(res.body.message).toBe("One of parameters is empty");
    }, 10000);

    test("should return error missing parameters - body missing ", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({})
            .expect("Content-Type", /json/)
            .expect(400);

        expect(res.body.message).toBe("One of parameters is empty");
    }, 10000);

    test("should return error not found account", async () => {
        const login_data = {
            email: "shahar123@gmail.com",
            password: "shahar1@gmail.com"
        }
        const res = await request(app)
            .post("/auth/login")
            .send(login_data)
            .expect("Content-Type", /json/)
            .expect(404);

        expect(res.body.message).toBe("Account not found");
    }, 10000);

    test("should return authentication failed", async () => {
        const login_data = {
            email: "shahar1@gmail.com",
            password: "asfsafddas"
        }
        const res = await request(app)
            .post("/auth/login")
            .send(login_data)
            .expect("Content-Type", /json/)
            .expect(400);

        expect(res.body.message).toBe("Authentication failed");
    }, 10000);

});

