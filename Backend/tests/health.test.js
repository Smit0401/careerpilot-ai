const request = require("supertest")
const app = require("../src/app")

describe("Health Route", () => {

    test("GET /api/health should return status ok", async () => {

        const response = await request(app)
            .get("/api/health")

        expect(response.statusCode).toBe(200)

        expect(response.body).toEqual({
            status: "ok"
        })

    })

})