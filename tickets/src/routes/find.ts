import express, { Request, Response } from "express";
import { body } from "express-validator";
import { NotFoundError } from "@mafunk/tix-common";

import { Ticket } from "../models/ticket";
const router = express.Router();

router.get(
  "/api/tickets/:id",

  async (req: Request, res: Response) => {
    const { id } = req.params;

<<<<<<< HEAD
    const ticket = await Ticket.findById(id);
=======
    const ticket = Ticket.findById(id);
>>>>>>> 65f0810d17d0db811d317665fd407c88c7cb5237
    if (!ticket) {
      throw new NotFoundError();
    }

    res.status(200).send(ticket);
  }
);

export { router as findTicketRouter };
