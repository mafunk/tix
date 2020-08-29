import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

it("returns list of tickets", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "ticket1", price: 1 })
    .expect(201);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "ticket2", price: 10 })
    .expect(201);

  const ticketResp = await request(app).get(`/api/tickets`).send().expect(200);

  expect(ticketResp.body).toHaveLength(2);
});
