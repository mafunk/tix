import Queue from "bull";
import { natsClient } from "@mafunk/tix-common";

import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";

const REDIS_HOST = process.env.REDIS_HOST!;

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log("finishing", job.data.orderId);
  new ExpirationCompletePublisher(natsClient.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
