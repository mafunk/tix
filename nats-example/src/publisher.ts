import nats from "node-nats-streaming";
import { randomBytes } from "crypto";

import { TicketCreatedPublisher } from "./events/tickets-created-publisher";

console.clear();

// nats docs uses stan
const client = nats.connect("tix", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

client.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const pub = new TicketCreatedPublisher(client);

  try {
    pub.publish({ id: "123", title: "concert", price: "$20" });
  } catch (error) {
    console.error(error);
  }

  // const data = JSON.stringify({
  //   id: "123",
  //   title: "concert",
  //   price: "$20",
  // });

  // client.publish("ticket:created", data, () => {
  //   console.log("Ticket Created event published");
  // });
});
