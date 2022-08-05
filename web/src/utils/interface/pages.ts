import { ReactNode } from "react";
import { User } from "../../generated/graphql";

export interface AppWithUserType {
  children?: ReactNode;
  user?: User;
}
