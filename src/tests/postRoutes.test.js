const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../server");
const { Post } = require("../models/PostModel");
const { User } = require("../models/UserModel");
const jwt = require("jsonwebtoken");

let mongoServer;
let adminToken;
let userToken;
let post;

beforeAll(async () => {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    // Create test admin and user
    const admin = await User.create({
        username: "adminUser",
        email: "admin@example.com",
        password: "password123",
        isAdmin: true,
    });

    const user = await User.create({
        username: "normalUser",
        email: "user@example.com",
        password: "password123",
        isAdmin: false,
    });

    // Generate JWTs
    adminToken = jwt.sign(
        { userId: user.userId, username: user.username, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_KEY || "testsecret",
        { expiresIn: "10h" }
    );

    userToken = jwt.sign(
        { userId: user.userId, username: user.username, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_KEY || "testsecret",
        { expiresIn: "10h" }
    );
});

beforeEach(async () => {
    await mongoose.connection.db.dropDatabase(); // Clear the database

    // Create a sample post
    post = await Post.create({
        title: "Sample Post",
        content: "This is a test post",
        createdBy: new mongoose.Types.ObjectId(),
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Post Routes", () => {
    it("should create a post (admin only)", async () => {
        const res = await request(app)
            .post("/posts")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                title: "New Post",
                content: "This is a new post",
            });

        expect(res.status).toBe(201);
        expect(res.body.post.title).toBe("New Post");
        expect(res.body.post.content).toBe("This is a new post");
    });

    it("should not allow non-admin to create a post", async () => {
        const res = await request(app)
            .post("/posts")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                title: "Unauthorized Post",
                content: "This should not be allowed",
            });

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Invalid or expired token.");
    });

    it("should fetch all posts", async () => {
        const res = await request(app).get("/");
        expect(res.status).toBe(200);
        expect(res.body.posts.length).toBe(1);
        expect(res.body.posts[0].title).toBe("Sample Post");
    });

    it("should update a post (admin only)", async () => {
        const res = await request(app)
            .put(`/posts/${post._id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                title: "Updated Post",
            });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("News post updated.");
    });

    it("should not allow non-admin to update a post", async () => {
        const res = await request(app)
            .put(`/posts/${post._id}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                title: "Unauthorized Update",
            });

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Invalid or expired token.");
    });

    it("should delete a post (admin only)", async () => {
        const res = await request(app)
            .delete(`/posts/${post._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Post deleted");
    });

    it("should not allow non-admin to delete a post", async () => {
        const res = await request(app)
            .delete(`/posts/${post._id}`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Invalid or expired token.");
    });
});