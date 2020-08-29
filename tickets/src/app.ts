import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@mafunk/tix-common";

import { createTicketRouter } from "./routes/new";
import { findTicketRouter } from "./routes/find";
import { getAllTicketsRouter } from "./routes/all";
import { updateTicketRouter } from "./routes/update";

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

app.get("/api/tickets/ping", (req, res) => {
  return res.send(Date());
});

// routes
app.use(createTicketRouter);
app.use(findTicketRouter);
app.use(getAllTicketsRouter);
app.use(updateTicketRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
