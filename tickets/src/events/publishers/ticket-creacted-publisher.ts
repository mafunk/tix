import { Publisher, Subjects, TicketCreatedEvent } from "@mafunk/tix-common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
