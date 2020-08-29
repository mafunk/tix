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
