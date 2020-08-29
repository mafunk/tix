import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

it("returns 404 if invalid ticket id", async () => {
  await request(app)
    .get(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .send()
    .expect(404);
});

it("returns ticket if valid ticket id", async () => {
  const title = "concert";
  const price = 20;

  const resp = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(201);

  const ticketResp = await request(app)
    .get(`/api/tickets/${resp.body.id}`)
    .send()
    .expect(200);

  expect(ticketResp.body.title).toEqual(title);
});

it("returns 404 if id does not exist", async () => {
  await request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .set("Cookie", global.signin())
    .send({ title: "cool", price: 10 })
    .expect(404);
});

it("returns 401 if not logged in", async () => {
  await request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .send({ title: "cool", price: 10 })
    .expect(401);
});

it("returns 401 if user does not own ticket", async () => {
  const resp = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "yee", price: 3 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "cool", price: 10 })
    .expect(401);
});

it("returns 400 if invalid title or price", async () => {
  const cookie = global.signin();

  const resp = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "yee", price: 3 })
    .expect(201);

  const updateResp1 = await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "cool", price: -1 })
    .expect(400);

  const updateResp2 = await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 10 })
    .expect(400);
});

it("updates ticket given correct params", async () => {
  const cookie = global.signin();

  const resp = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "yee", price: 3 })
    .expect(201);

  const updateResp = await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "cool", price: 10 })
    .expect(200);

  expect(updateResp.body.title).toEqual("cool");
  expect(updateResp.body.price).toEqual(10);
});
