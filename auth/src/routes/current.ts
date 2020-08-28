import express from "express";
import { currentUser } from "@mafunk/tix-common";

const router = express.Router();

router.get("/api/users/current", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser });
});

export { router as currentRouter };
