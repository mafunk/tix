import { Message } from "node-nats-streaming";

import { Subjects, Listener, PaymentCreatedEvent } from "@mafunk/tix-common";

import { queueGroupName } from "./config";
import { Order, OrderStatus } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const { orderId, id } = data;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    order.set({
      status: OrderStatus.Complete,
      paymentId: id,
    });
    await order.save();

    // order:coplete or order:updated event

    msg.ack();
  }
}
