const request = require("supertest");
const { app } = require("../server");


beforeEach(() => {
    fetch.resetMocks();
});

describe("Anime Routes", () => {
    it("should respond with a message for the root route", async () => {
        const response = await request(app).get("/anime");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Anime routes live here!");
    });

    it("should fetch random anime", async () => {
        fetch.mockResponseOnce(
            JSON.stringify({
                data: {
                    title: "Random Anime",
                },
            })
        );

        const response = await request(app).get("/anime/random");
        expect(response.status).toBe(200);
        expect(response.body.result.data.title).toBe("Random Anime");
    });

    it("should browse anime by title", async () => {
        fetch.mockResponseOnce(
            JSON.stringify({
                data: [
                    {
                        title: "Naruto",
                    },
                ],
            })
        );

        const response = await request(app).get("/anime/browse").query({ title: "Naruto" });
        expect(response.status).toBe(200);
        expect(response.body.data[0].title).toBe("Naruto");
    });

    it("should fetch anime by genre", async () => {
        fetch.mockResponseOnce(
            JSON.stringify({
                data: [
                    {
                        title: "Attack on Titan",
                        genre: "Action",
                    },
                ],
            })
        );

        const response = await request(app).get("/anime/genre").query({ genre: "Action" });
        expect(response.status).toBe(200);
        expect(response.body.genres[0].title).toBe("Attack on Titan");
    });

    it("should return 400 if genre is missing", async () => {
        const response = await request(app).get("/anime/genre");
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Provide a genre.");
    });

    it("should fetch anime recommendations by title", async () => {
        // Mock first API call to get `mal_id`
        fetch.mockResponses(
            [
                JSON.stringify({
                    data: [
                        {
                            mal_id: 1,
                        },
                    ],
                }),
            ],
            [
                JSON.stringify({
                    data: [
                        {
                            title: "My Hero Academia",
                        },
                    ],
                }),
            ]
        );

        const response = await request(app)
            .get("/anime/recommendations")
            .query({ title: "Attack on Titan" });

        expect(response.status).toBe(200);
        expect(response.body.data[0].title).toBe("My Hero Academia");
    });

    it("should return 400 if title is missing for recommendations", async () => {
        const response = await request(app).get("/anime/recommendations");
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Title is required to fetch recommendations.");
    });
});