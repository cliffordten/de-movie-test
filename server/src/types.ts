import { Request, Response } from "express";
import Redis from "ioredis";
import { InputType, Field, ObjectType } from "type-graphql";
import { QuizResult } from "./entities/QuizResult";
import { User } from "./entities/User";

// app input typess
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

@InputType()
export class PreviousQuizResponseInput {
  @Field(() => String, { nullable: true })
  prevQuestionId?: string;

  @Field(() => Boolean, { nullable: true })
  response?: boolean;
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
  @Field(() => String, { nullable: true })
  movieName?: string;

  @Field(() => String, { nullable: true })
  movieImage?: string;
}

@ObjectType()
export class ActorType {
  @Field(() => String, { nullable: true })
  actorName?: string;

  @Field(() => String, { nullable: true })
  actorImage?: string;
}

@ObjectType()
export class QuizType {
  @Field(() => String, { nullable: true })
  id: string;

  @Field(() => MovieType, { nullable: true })
  movie!: MovieType;

  @Field(() => ActorType, { nullable: true })
  actor!: ActorType;
}

@ObjectType()
export class Gametype {
  @Field(() => Boolean, { defaultValue: false })
  isGameOver: boolean;

  @Field(() => Number, { defaultValue: 0 })
  noQuestionAnswered!: number;

  @Field(() => String, { nullable: true })
  lastQuestionId?: string;
}

@ObjectType()
export class QuizResponse {
  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;

  @Field(() => QuizType, { nullable: true })
  quiz?: QuizType;

  @Field(() => Gametype, { nullable: true })
  game?: Gametype;
}

@ObjectType()
export class QuizResultResponse {
  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;

  @Field(() => QuizResult, { nullable: true })
  result?: QuizResult;
}

@ObjectType()
export class UserResultResponse {
  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;

  @Field(() => [QuizResult], { nullable: true })
  result?: QuizResult[];
}
