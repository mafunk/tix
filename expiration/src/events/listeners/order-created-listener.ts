import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@mafunk/tix-common";

import { queueGroupName } from "./config";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, expiresAt } = data;

    const delay = new Date(expiresAt).getTime() - new Date().getTime();
    console.log("Beginning timer: ", delay);

    await expirationQueue.add(
      id,
      {
        orderId: id,
      },
      { delay }
    );

    msg.ack();
  }
}
