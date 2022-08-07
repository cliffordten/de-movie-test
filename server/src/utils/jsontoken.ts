import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { ErrorType, UserSessionType } from "../types";
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

export const checkIfUserSessionExist = (
  header: any
): { error: ErrorType } | null => {
  if (header.jwtExpired) {
    return {
      error: {
        field: "sessionExpired",
        message: "User Session Expired, Please loggin again",
      },
    };
  }

  if (!header.userId) {
    return {
      error: {
        field: "headers",
        message: "User not logged in",
      },
    };
  }

  return null;
};
