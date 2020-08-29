import { Publisher, Subjects, OrderCancelledEvent } from "@mafunk/tix-common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
