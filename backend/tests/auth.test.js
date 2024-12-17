const request = require("supertest");
const app = require("../app");
const dbConnection = require("../db_connection/db_connection");
const User = require("../db_models/user.model");


let server;

const user1 = {
    name: "shahar1",
    email: "shahar1@gmail.com",
    password: "shahar1@gmail.com",
    phone: "050000000",
}

const user2 = {
    name: "shahar2",
    email: "shahar2@gmail.com",
    password: "shahar2@gmail.com",
    phone: "050000000",
}

const user3 = {
    name: "shahar3",
    email: "shahar3@gmail.com",
    password: "shahar3@gmail.com",
    phone: "050000000",
}

beforeAll(() => {
    server = app.listen(8000); // Start the server
});

afterAll(async() => {
    try{
        await User.deleteOne({email: user1.email});
        await User.deleteOne({email: user2.email});
        await User.deleteOne({email: user3.email});
        await dbConnection.close();
    } catch(err) {
        console.log(err);
    }
    finally {
        server.close(); // Close the server
    }
});

describe("POST /auth/register", () => {
    test("should get the user info", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send(user1)
            .expect("Content-Type", /json/)
            .expect(200);
        expect(res.body.message).toBe("Successfully created user");
    }, 10000);

    test("should get duplicate error", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send(user1)
            .expect("Content-Type", /json/)
            .expect(401);
        expect(res.body.message).toBe("Duplicate user");

    }, 10000);

    test("should get missing parameters - email missing", async () => {
        const {email, ...user} = user1;
        const res = await request(app)
            .post("/auth/register")
            .send(user)
            .expect("Content-Type", /json/)
            .expect(401);
        expect(res.body.message).toBe("One of parameters is empty");

    }, 10000);

    test("should get missing parameters - password missing", async () => {
        const {password, ...user} = user1;
        const res = await request(app)
            .post("/auth/register")
            .send(user)
            .expect("Content-Type", /json/)
            .expect(401);
        expect(res.body.message).toBe("One of parameters is empty");

    }, 10000);

    test("should get missing parameters - name missing", async () => {
        const {name, ...user} = user1;
        const res = await request(app)
            .post("/auth/register")
            .send(user)
            .expect("Content-Type", /json/)
            .expect(401);
        expect(res.body.message).toBe("One of parameters is empty");

    }, 10000);

    test("should get missing parameters - phone missing", async () => {
        const {phone, ...user} = user1;
        const res = await request(app)
            .post("/auth/register")
            .send(user)
            .expect("Content-Type", /json/)
            .expect(401);
        expect(res.body.message).toBe("One of parameters is empty");

    }, 10000);

});


describe("POST /auth/login", () => {
    test("should return the user info ", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send(user1)
            .expect("Content-Type", /json/)
            .expect(200);

        const {password, ...user} = user1;
        expect(res.body).toEqual(
            expect.objectContaining(user)
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
            .expect(401);
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
            .expect(401);

        expect(res.body.message).toBe("One of parameters is empty");
    }, 10000);

    test("should return error missing parameters - body missing ", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({})
            .expect("Content-Type", /json/)
            .expect(401);

        expect(res.body.message).toBe("One of parameters is empty");
    }, 10000);

});

