import request from "supertest"
import app from "../app"
import { mockDataService } from "../utils/mock-data"

describe("Authentication", () => {
  beforeAll(async () => {
    await mockDataService.clearMockData()
  })

  afterAll(async () => {
    await mockDataService.clearMockData()
  })

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const userData = {
        email: "test@example.com",
        name: "Test User",
        password: "password123",
        phone: "+91-9876543210",
      }

      const response = await request(app).post("/api/auth/register").send(userData).expect(201)

      expect(response.body).toHaveProperty("user")
      expect(response.body).toHaveProperty("token")
      expect(response.body.user.email).toBe(userData.email)
      expect(response.body.user.name).toBe(userData.name)
      expect(response.body.user).not.toHaveProperty("password_hash")
    })

    it("should not register user with existing email", async () => {
      const userData = {
        email: "test@example.com",
        name: "Another User",
        password: "password123",
      }

      await request(app).post("/api/auth/register").send(userData).expect(409)
    })

    it("should validate required fields", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "test2@example.com",
          // missing name and password
        })
        .expect(400)

      expect(response.body.error).toBe("Validation Error")
    })
  })

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password123",
        })
        .expect(200)

      expect(response.body).toHaveProperty("user")
      expect(response.body).toHaveProperty("token")
    })

    it("should not login with invalid credentials", async () => {
      await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "wrongpassword",
        })
        .expect(401)
    })
  })

  describe("GET /api/auth/profile", () => {
    let authToken: string

    beforeAll(async () => {
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      })

      authToken = loginResponse.body.token
    })

    it("should get user profile with valid token", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toHaveProperty("user")
      expect(response.body).toHaveProperty("stats")
    })

    it("should not get profile without token", async () => {
      await request(app).get("/api/auth/profile").expect(401)
    })

    it("should not get profile with invalid token", async () => {
      await request(app).get("/api/auth/profile").set("Authorization", "Bearer invalid-token").expect(401)
    })
  })
})
