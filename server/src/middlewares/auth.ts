import { NextFunction, Request, Response } from "express";
import { redis } from "../utils/redis";
import { verifyToken } from "../utils/jsontoken";

export const AuthMiddleWare = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace("bearer ", "");
      const jwtToken = await redis.get(token);
      if (jwtToken) {
        const payload = verifyToken(jwtToken);
        const { id, email } = payload;

        if (email && id) {
          req.headers.userId = id;
          req.headers.userEmail = email;
          req.headers.jwtToken = jwtToken;
        }
      }
    }
  } catch (error) {
    if (error.message?.includes("expired")) {
      req.headers.jwtExpired = "true";
    }
    console.log(
      "%cauth.ts line:16 error",
      "color: #007acc;",
      error.message,
      error.code
    );
  }
  next();
};

export default AuthMiddleWare;
