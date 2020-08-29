import nats from "node-nats-streaming";
import { randomBytes } from "crypto";

import { TicketCreatredListener } from "./events/ticket-created-listener";

console.clear();

// nats docs uses stan
const client = nats.connect("tix", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

client.on("connect", async () => {
  console.log("Listener connected to NATS");

  client.on("close", () => {
    console.log("NATS closed");
    process.exit();
  });

  new TicketCreatredListener(client).listen();
});

process.on("SIGINT", () => client.close());
process.on("SIGTERM", () => client.close());
