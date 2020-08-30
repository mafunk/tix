// todo: remove from queue if cancelled
// dont think its possible with bull
import { Message } from "node-nats-streaming";
import { Listener, OrderCancelledEvent, Subjects } from "@mafunk/tix-common";

import { queueGroupName } from "./config";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const { id } = data;
    console.log("Removing job: ", id);

    expirationQueue.removeJobs(id).then(() => {
      console.log("Removed job: ", id);
    });

    msg.ack();
  }
}
