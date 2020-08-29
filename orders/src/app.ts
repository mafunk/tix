import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@mafunk/tix-common";

import { getAllOrdersRouter } from "./routes/all";
import { findOrderRouter } from "./routes/find";
import { createOrderRouter } from "./routes/new";
import { deleteOrderRouter } from "./routes/delete";

const app = express();

app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

app.get("/api/orders/ping", (req, res) => {
  return res.send(Date());
});

// routes
app.use(getAllOrdersRouter);
app.use(findOrderRouter);
app.use(createOrderRouter);
app.use(deleteOrderRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
