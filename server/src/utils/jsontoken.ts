import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { UserSessionType } from "../types";
import config from "../constants";

export const getToken = (data: UserSessionType) => {
  return jwt.sign(data, config.secret as Secret, {
    expiresIn: config.jwtDuration,
  });
};

export const verifyToken = (token: string): JwtPayload & UserSessionType => {
  return jwt.verify(token, config.secret as Secret) as JwtPayload &
    UserSessionType;
};
