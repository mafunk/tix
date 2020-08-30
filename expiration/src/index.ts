import { natsClient } from "@mafunk/tix-common";

import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

const NATS_URL = process.env.NATS_URL!;
const NATS_CLUTSER_ID = process.env.NATS_CLUSTER_ID!;
const NATS_CLIENT_ID = process.env.NATS_CLIENT_ID!;
const REDIS_HOST = process.env.REDIS_HOST!;

async function start() {
  try {
    if (!NATS_URL) {
      throw new Error("NATS_URL must be defined");
    }

    if (!NATS_CLUTSER_ID) {
      throw new Error("NATS_CLUTSER_ID must be defined");
    }

    if (!NATS_CLIENT_ID) {
      throw new Error("NATS_CLIENT_ID must be defined");
    }

    if (!REDIS_HOST) {
      throw new Error("REDIS_HOST must be defined");
    }

    await natsClient.connect();

    natsClient.client.on("close", () => {
      console.log("NATS connection closed");
    });

    process.on("SIGINT", () => natsClient.client.close());
    process.on("SIGTERM", () => natsClient.client.close());

    new OrderCreatedListener(natsClient.client).listen();
    new OrderCancelledListener(natsClient.client).listen();
  } catch (error) {
    console.log(error);
  }
}

start();
