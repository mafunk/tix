import express, { Request, Response } from "express";
import { body } from "express-validator";
import { NotFoundError } from "@mafunk/tix-common";

import { Ticket } from "../models/ticket";
const router = express.Router();

router.get(
  "/api/tickets",

  async (req: Request, res: Response) => {
    const { id } = req.params;

    const tickets = await Ticket.find({});
    if (!tickets) {
      throw new NotFoundError();
    }

    res.status(200).send(tickets);
  }
);

export { router as getAllTicketsRouter };
