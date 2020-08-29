import { Subjects } from "./subjects";

export interface OrderCancelleddEvent {
  subject: Subjects.OrderCancelled;

  data: {
    id: string;
    version: number;

    ticket: {
      id: string;
    };
  };
}
