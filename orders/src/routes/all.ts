import express, { Request, Response } from "express";
import { requireAuth } from "@mafunk/tix-common";

import { Order } from "../models/order";
const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const userId = req.currentUser!.id;

  const orders = await Order.find({
    userId,
  }).populate("ticket");

  res.status(200).send(orders);
});

export { router as getAllOrdersRouter };
