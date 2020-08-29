import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("listening to /api/tickets for post request", async () => {
  const resp = await request(app).post("/api/tickets").send({});

  expect(resp.status).not.toEqual(404);
});

it("only be accessed if user is signed in - 401 if not logged in", async () => {
  const resp = await request(app).post("/api/tickets").send({});

  expect(resp.status).toEqual(401);
});

it("only be accessed if user is signed in - not 401 if logged in", async () => {
  const resp = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});

  expect(resp.status).not.toEqual(401);
});

it("returns an error if invalid title", async () => {
  const resp = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "", price: 10 });

  expect(resp.status).toEqual(400);
});

it("returns an error if invalid price", async () => {
  const resp = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "awesome", price: -10 });

  expect(resp.status).toEqual(400);
});

it("creates ticket with valid params", async () => {
  const resp = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "awesome", price: 10 });

  expect(resp.status).toEqual(201);

  const tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});
