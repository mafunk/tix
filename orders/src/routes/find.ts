import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@mafunk/tix-common";

import { Order } from "../models/order";
const router = express.Router();

router.get(
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

    res.status(200).send(order);
  }
);

export { router as findOrderRouter };
