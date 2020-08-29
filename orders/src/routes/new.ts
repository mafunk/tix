import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import {
  requireAuth,
  validateRequest,
  natsClient,
  NotFoundError,
  BadRequestError,
} from "@mafunk/tix-common";

import { Order, OrderStatus } from "../models/order";
import { Ticket } from "../models/ticket";
//import { TicketCreatedPublisher } from "../events/publishers/ticket-creacted-publishers";

const EXPIRATION_SECONDS = 15 * 60; // 15 minutes

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket id is required"),
  ],
  validateRequest,

  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const userId = req.currentUser!.id;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket already reserved");
    }

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_SECONDS);

    const newOrder = await Order.build({
      status: OrderStatus.Created,
      userId,
      expiresAt,
      ticket,
    });
    await newOrder.save();

    // new TicketCreatedPublisher(natsClient.client).publish({
    //   id: ticket.id,
    //   title: ticket.title,
    //   price: ticket.price.toString(),
    //   userId: ticket.userId,
    // });

    res.status(201).send(newOrder);
  }
);

export { router as createOrderRouter };
