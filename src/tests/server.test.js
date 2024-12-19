const {app} = require("../server");
const request = require ("supertest"); 


//root route testing
describe ("Root route", () => {
    test("Server returns a 'Welcome to the last project!' message", async () => {
        const response = await request(app).get("/"); 

        expect(response.body.message).toBe("Welcome to the last project!"); 
    }); 
});

