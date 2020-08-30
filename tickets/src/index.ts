import mongoose from "mongoose";
import { natsClient } from "@mafunk/tix-common";

import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

import { app } from "./app";

const MONGO_URI = process.env.MONGO_URI!;
const NATS_URL = process.env.NATS_URL!;
const NATS_CLUTSER_ID = process.env.NATS_CLUSTER_ID!;
const NATS_CLIENT_ID = process.env.NATS_CLIENT_ID!;

async function start() {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY must be defined");
    }

    if (!MONGO_URI) {
      throw new Error("MONGO_URI must be defined");
    }

    if (!NATS_URL) {
      throw new Error("NATS_URL must be defined");
    }

    if (!NATS_CLUTSER_ID) {
      throw new Error("NATS_CLUTSER_ID must be defined");
    }

    if (!NATS_CLIENT_ID) {
      throw new Error("NATS_CLIENT_ID must be defined");
    }

    await natsClient.connect();

    natsClient.client.on("close", () => {
      console.log("NATS connection closed");
    });

    process.on("SIGINT", () => natsClient.client.close());
    process.on("SIGTERM", () => natsClient.client.close());

    new OrderCreatedListener(natsClient.client).listen();
    new OrderCancelledListener(natsClient.client).listen();

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("Connected to Mongo");

    app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
  } catch (error) {
    console.log(error);
  }
}

start();
