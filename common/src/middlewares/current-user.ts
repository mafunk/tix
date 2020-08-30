import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

//const JWT_SECRET = process.env.JWT_KEY!;

interface UserPayload {
  email: string;
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // @ts-ignore
  if (!req.session?.jwt) return next();

  try {
    // @ts-ignore
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;

    req.currentUser = payload;
  } catch (error) {
    // not empty
  }

  next();
};
