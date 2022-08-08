import { Request, Response } from "express";

export const checkHealth = (_: Request, res: Response): void => {
  res.status(200).send("Ok");
};
