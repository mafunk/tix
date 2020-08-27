import express from "express";

const router = express.Router();

router.get("/api/users/current", (req, res) => {
  res.send("hi");
});

export { router as currentRouter };
