import { Publisher, Subjects, PaymentCreatedEvent } from "@mafunk/tix-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
