import express from "express";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { Password } from "../services/password";
import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError } from "../errors/bad-request-error";

const JWT_SECRET = process.env.JWT_KEY!;

const router = express.Router();

router.get("/api/users/current", (req, res) => {
  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }

  try {
    const payload = jwt.verify(req.session.jwt, JWT_SECRET);

    res.send({ currentUser: payload });
  } catch (error) {
    return res.send({ currentUser: null });
  }
});

export { router as currentRouter };
