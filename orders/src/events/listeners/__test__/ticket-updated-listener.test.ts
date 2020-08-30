import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@mafunk/tix-common";

import { TicketUpdatedListener } from "../ticket-updated-listener";
import { Ticket } from "../../../models/ticket";

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
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsClient.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();

  // create a fake data event
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "new concert",
    price: 24,
    userId: "userss",
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("finds, updates, and saves ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
  const { listener, data, msg, ticket } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
