import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent } from "@mafunk/tix-common";

import { OrderCreatedListener } from "../order-created-listener";
import { Order, OrderStatus } from "../../../models/order";

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

const setup = async () => {
  const listener = new OrderCreatedListener(natsClient.client);

  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "alskdjf",
    userId: "alskdjf",
    status: OrderStatus.Created,
    ticket: {
      id: "alskdfj",
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("replicates the order info", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
