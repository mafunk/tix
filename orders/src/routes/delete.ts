import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotFoundError,
  NotAuthorizedError,
  requireAuth,
  natsClient,
} from "@mafunk/tix-common";

import { Order, OrderStatus } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publishers";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.currentUser!.id;

    const order = await Order.findById(id).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== userId) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsClient.client).publish({
      id: order.id,

      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
