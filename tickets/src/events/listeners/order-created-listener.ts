import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@mafunk/tix-common";

import { queueGroupName } from "./config";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, ticket } = data;

    const foundTicket = await Ticket.findById(ticket.id);
    if (!foundTicket) {
      throw new Error("Ticket not found");
    }

    foundTicket.set({ orderId: id });
    await foundTicket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: foundTicket.id,
      version: foundTicket.version,
      title: foundTicket.title,
      price: foundTicket.price,
      userId: foundTicket.userId,
      orderId: foundTicket.orderId,
    });

    msg.ack();
  }
}
