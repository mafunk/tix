import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotFoundError,
  NotAuthorizedError,
  requireAuth,
} from "@mafunk/tix-common";

import { Order, OrderStatus } from "../models/order";
const router = express.Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.currentUser!.id;

    const order = await Order.findById(id);
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== userId) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
