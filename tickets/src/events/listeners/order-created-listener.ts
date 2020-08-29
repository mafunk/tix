import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@mafunk/tix-common";

import { queueGroupName } from "./config";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = new Subjects.OrderCreated();
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, ticket } = data;

    const ticket = await Ticket.findById(ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: id });
    await ticket.save();

    await new TicketUpdatedPublisher(natsClient.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
