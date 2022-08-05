import { Request, Response } from "express";
import { InputType, Field, ObjectType } from "type-graphql";
import { User } from "./entities/User";

//app interface
// class AppSession extends Response.session {
//   userId: string;
// }

// app input types
@InputType()
export class UserInput {
  @Field(() => String)
  username!: string;
  @Field(() => String)
  email!: string;
  @Field(() => String)
  password!: string;
  @Field(() => String)
  confirmPassword!: string;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  email!: string;
  @Field(() => String)
  password!: string;
}

// app object types e
@ObjectType()
export class AppContext {
  @Field(() => Request)
  req!: Request & { session: Express.SessionStore & { userId: string } };
  @Field(() => Response)
  res!: Response;
}

@ObjectType()
export class ErrorType {
  @Field(() => String, { nullable: true })
  field?: string;
  @Field(() => String)
  message!: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
  @Field(() => User, { nullable: true })
  user?: User;
}
