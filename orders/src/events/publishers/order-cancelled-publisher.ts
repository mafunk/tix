import { Publisher, Subjects, OrderCancelledEvent } from "@mafunk/tix-common";

export class OrerCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
