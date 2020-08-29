import { Publisher, Subjects, TicketUpdatedEvent } from "@mafunk/tix-common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
