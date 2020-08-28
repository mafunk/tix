import mongoose from "mongoose";

import { app } from "./app";

async function start() {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
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
