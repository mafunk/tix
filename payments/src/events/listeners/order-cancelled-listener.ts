import { Message } from "node-nats-streaming";
import { Listener, OrderCancelledEvent, Subjects } from "@mafunk/tix-common";

import { queueGroupName } from "./config";
import { Order, OrderStatus } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const { id, version } = data;

    const foundOrder = await Order.findByEvent({ id, version });
    if (!foundOrder) {
      throw new Error("Order not found");
    }

    foundOrder.set({ status: OrderStatus.Cancelled });
    await foundOrder.save();

    msg.ack();
  }
}
