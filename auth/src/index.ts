import mongoose from "mongoose";

import { app } from "./app";

const MONGO_URI = process.env.MONGO_URI!;

async function start() {
  console.log("Starting up");

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("Connected to mongo");

    app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
  } catch (error) {
    console.log(error);
  }
}

start();
