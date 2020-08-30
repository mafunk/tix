import { Message } from "node-nats-streaming";
import { Listener, OrderCancelledEvent, Subjects } from "@mafunk/tix-common";

import { queueGroupName } from "./config";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const { ticket } = data;

    const foundTicket = await Ticket.findById(ticket.id);

    if (!foundTicket) {
      throw new Error("Ticket not found");
    }

    foundTicket.set({ orderId: undefined });
    await foundTicket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: foundTicket.id,
      orderId: foundTicket.orderId,
      userId: foundTicket.userId,
      price: foundTicket.price,
      title: foundTicket.title,
      version: foundTicket.version,
    });

    msg.ack();
  }
}
