import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@mafunk/tix-common";

import { queueGroupName } from "./config";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, status, userId, version, ticket } = data;

    const order = Order.build({
      id,
      status,
      userId,
      version,
      price: ticket.price,
    });

    await order.save();

    msg.ack();
  }
}
