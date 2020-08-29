import express, { Request, Response } from "express";
import { body } from "express-validator";
import { NotFoundError } from "@mafunk/tix-common";

import { Ticket } from "../models/ticket";
const router = express.Router();

router.get(
  "/api/tickets",

  async (req: Request, res: Response) => {
    const { id } = req.params;

<<<<<<< HEAD
    const tickets = await Ticket.find({});
=======
    const tickets = Ticket.find({});
>>>>>>> 65f0810d17d0db811d317665fd407c88c7cb5237
    if (!tickets) {
      throw new NotFoundError();
    }

    res.status(200).send(tickets);
  }
);

export { router as getAllTicketsRouter };
