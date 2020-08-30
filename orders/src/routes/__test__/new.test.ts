import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";

const natsClient = jest.fn().mockReturnValue(() => {
  return {
    client: {
      publish: jest
        .fn()
        .mockImplementation(
          (subject: string, data: string, callback: () => void) => {
            callback();
          }
        ),
    },
  };
});

it("returns 404 if ticket doesnt exist", async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});

it("returns 400 if ticket already reserved", async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 4,
  });

  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "tester",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();

  request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("returns new order on success", async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 4,
  });

  await ticket.save();

  request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("emits order created event", async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 4,
  });

  await ticket.save();

  request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
