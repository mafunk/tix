import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@mafunk/tix-common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
