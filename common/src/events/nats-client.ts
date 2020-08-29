import nats, { Stan } from "node-nats-streaming";

const NATS_URL = process.env.NATS_URL!;
const NATS_CLUTSER_ID = process.env.NATS_CLUSTER_ID!;
const NATS_CLIENT_ID = process.env.NATS_CLIENT_ID!;

class NatsClient {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("NATS not connected");
    }

    return this._client;
  }

  connect(clientId?: string) {
    this._client = nats.connect(NATS_CLUTSER_ID, clientId || NATS_CLIENT_ID, {
      url: NATS_URL,
    });

    return new Promise((resolve, reject) => {
      this.client.on("connect", () => {
        console.log(
          `Connected to NATS[${NATS_CLUTSER_ID}] as ${NATS_CLIENT_ID}`
        );

        resolve();
      });

      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsClient = new NatsClient();
