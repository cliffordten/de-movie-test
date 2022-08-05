import { NextFunction, Request, Response } from "express";

export const LoggerMiddleWare = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.originalUrl.includes("health") && req.body) {
    console.log(
      `${req.method} ${req.protocol}:///${req.get("host")}${req.originalUrl}\n`
    );
    console.log(`request body ${req.body}\n\n`);
  }
  next();
};

export default LoggerMiddleWare;
