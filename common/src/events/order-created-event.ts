import { Subjects } from "./subjects";

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;

  data: {
    id: string;
    version: number;

    userId: string;
    status: string;
    expiresAt: string;

    ticket: {
      id: string;
      price: number;
    };
  };
}
