const request = require('supertest');
const mongoose = require ("mongoose"); 
const {app} = require ('../server.js');
const jwt = require("jsonwebtoken");  
const { MongoMemoryServer } = require("mongodb-memory-server");
const {User} = require ('../models/UserModel.js'); 
const bcrypt = require("bcryptjs");
let mongoServer;
let token;
let user;

beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});



beforeEach(async () => {
    await mongoose.connection.db.dropDatabase(); // Clear the database

    try {
        const hashedPassword = await bcrypt.hash("password123", 10);
        user = await User.create({
            username: "testUser",
            email: "test@example.com",
            password: hashedPassword,
        });
        console.log("Created user:", user); // Log the created user
    } catch (error) {
        console.error("Error creating user:", error.message); // Log any errors
    }
});


afterAll(async () => {
    // Disconnect and stop MongoDB server
    await mongoose.disconnect();
    await mongoServer.stop();
});


describe("User Routes", () => {
    describe("POST /signup", () => {
        it("should create a new user and return a JWT", async () => {
            const response = await request(app).post("/signup").send({
                username: "testUser",
                email: "test@example.com",
                password: "password123",
                isAdmin: false,
            });

            expect(response.status).toBe(200);
            expect(response.body.jwt).toBeDefined();
            expect(response.body.user.username).toBe("testUser");

            // Verify user exists in the database
            const user = await User.findOne({ email: "test@example.com" });
            expect(user).not.toBeNull();
            expect(user.username).toBe("testUser");
        });

        it("should return 409 if the email already exists", async () => {
            await User.create({
                username: "existingUser",
                email: "test@example.com",
                password: "password123",
            });

            const response = await request(app).post("/signup").send({
                username: "testUser",
                email: "test@example.com",
                password: "password123",
            });

            expect(response.status).toBe(409);
            expect(response.body.message).toBe("Email already in use. ");
        });

        it("should return 400 for missing credentials", async () => {
            const response = await request(app).post("/signup").send({ email: "test@example.com" });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Incorrect or missing credentials.");
        });

        console.log("Created user:", user);
    });

    describe("POST /auth/login", () => {
        it("should login an existing user and return a JWT", async () => {
            const passwordHash = await bcrypt.hash("password123", 10); // Hash the password
            await User.create({
                username: "testUser",
                email: "test@example.com",
                password: passwordHash,
            });
        
            const response = await request(app).post("/auth/login").send({
                email: "test@example.com",
                password: "password123", // Provide plaintext password for comparison
            });
        
            expect(response.status).toBe(200);
            expect(response.body.jwt).toBeDefined();
            expect(response.body.user.email).toBe("test@example.com");
        });

        it("should return 404 if the user does not exist", async () => {
            const response = await request(app).post("/auth/login").send({
                email: "nonexistent@example.com",
                password: "password123",
            });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("User not found.");
        });

        it("should return 401 for incorrect password", async () => {
            const passwordHash = await bcrypt.hash("password123", 10);
            await User.create({
                username: "testUser",
                email: "test@example.com",
                password: passwordHash,
            });

            const response = await request(app).post("/auth/login").send({
                email: "test@example.com",
                password: "wrongpassword",
            });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Invalid credentials.");
        });
    });

    describe("GET /profile/me", () => {
        let token;

        beforeEach(async () => {
            // Create a user and generate a token for authentication
            const user = await User.create({
                username: "testUser",
                email: "test@example.com",
                password: "password123",
            });

            token = jwt.sign(
                { userId: user.id, username: user.username, email: user.email },
                process.env.JWT_SECRET_KEY || "testsecret", // Use test secret for testing
                { expiresIn: "1h" }
            );
        });

        it("should return the user's profile", async () => {
            const response = await request(app)
                .get("/profile/me")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.username).toBe("testUser");
            expect(response.body.email).toBe("test@example.com");
        }, 10000);

        it("should return 401 if no token is provided", async () => {
            const response = await request(app).get("/profile/me");
            expect(response.status).toBe(401); // Unauthorized
            expect(response.body.message).toBe("Unauthorized: No token provided");
        });

        it("should return 404 if the user does not exist", async () => {
            await mongoose.connection.db.dropDatabase(); // Clear DB
        
            const response = await request(app)
                .get("/profile/me")
                .set("Authorization", `Bearer ${token}`);
        
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("User not found");
        });
    });
});
