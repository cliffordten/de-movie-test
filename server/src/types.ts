import { InputType, Field, ObjectType } from "type-graphql";
import { User } from "./entities/User";

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
