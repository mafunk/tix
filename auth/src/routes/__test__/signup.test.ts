import request from "supertest";
import { app } from "../../app";

it("returns a 201 successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@email.com",
      password: "thisislong",
    })
    .expect(201);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@email.com",
      password: "thisislong",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});

it("does not allow same email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@email.com", password: "thisislong" })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@email.com", password: "thisislong" })
    .expect(401);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test", password: "test" })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@email.com", password: "1" })
    .expect(400);
});

it("returns a 400 with missing fields", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@email.com" })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({ password: "test@email.com" })
    .expect(400);
});
