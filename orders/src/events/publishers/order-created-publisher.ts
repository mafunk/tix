import { Publisher, Subjects, OrderCreatedEvent } from "@mafunk/tix-common";

export class OrerCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
