import { Request, Response } from "express";
import Redis from "ioredis";
import { InputType, Field, ObjectType } from "type-graphql";
import { User } from "./entities/User";

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

// app object types
@ObjectType()
export class AppContext {
  @Field(() => Request)
  req!: Request;
  @Field(() => Response)
  res!: Response;
  @Field(() => Redis)
  redis!: Redis;
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

@ObjectType()
export class UserSessionType {
  @Field(() => String)
  id: string;
  @Field(() => String)
  email: string;
}
