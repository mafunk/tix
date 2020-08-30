import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;

  data: any;
}

abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  protected client: Stan;
  protected ackWait = 1000 * 5; // 5 seconds

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const sub = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    sub.on("message", (msg: Message) => {
      const data = this.parseMessage(msg);

      console.log(
        `Message receieved[${Date()}]: ${this.subject} / ${
          this.queueGroupName
        } - ${data.id}.${data.version}`
      );

      this.onMessage(data, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();

    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}

export { Listener };
