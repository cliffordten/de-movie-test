import { Request, Response } from "express";
import Redis from "ioredis";
import { InputType, Field, ObjectType } from "type-graphql";
import { QuizResult } from "./entities/QuizResult";
import { User } from "./entities/User";

// app input type zs
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

@InputType()
export class UserQuizResponseInput {
  @Field(() => String)
  questionId!: string;
  @Field(() => Boolean)
  response!: boolean;
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

// quiz types

@ObjectType()
export class MovieType {
  @Field(() => String)
  movieName?: string;
  @Field(() => String)
  movieImage?: string;
}

@ObjectType()
export class ActorType {
  @Field(() => String)
  actorName?: string;
  @Field(() => String)
  actorImage?: string;
}

@ObjectType()
export class QuizType {
  @Field(() => String)
  id: string;

  @Field(() => MovieType)
  movie!: MovieType;

  @Field(() => ActorType)
  actor!: ActorType;
}

@ObjectType()
export class QuizResponse {
  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
  @Field(() => QuizType, { nullable: true })
  quiz?: QuizType;
}

@ObjectType()
export class QuizResultResponse {
  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
  @Field(() => QuizResult, { nullable: true })
  result?: QuizResult;
}
