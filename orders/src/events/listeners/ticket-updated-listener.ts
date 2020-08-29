import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
  natClient,
} from "@mafunk/tix-common";

import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./config";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price, version } = data;

    const ticket = await Ticket.fineOne({ _id: id, version: version - 1]});
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({title, price})
    await ticket.save();

    msg.ack();
  }
}
