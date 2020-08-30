import request from "supertest";
import { app } from "../../app";

it("fails when an email that does not exist is used", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@email.com", password: "stuff" })
    .expect(400);
});

it("fails when an incorrect password is used", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@email.com", password: "thisislong" })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@email.com", password: "notlong" })
    .expect(400);
});

it("responds with cookie", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@email.com", password: "thisislong" })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@email.com", password: "thisislong" })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
