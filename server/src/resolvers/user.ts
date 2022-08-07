// import { generateHash } from "../utils/passEncrypt";
import { loginSchema, registerSchema } from "../utils/yup/auth.schema";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../entities/User";
import {
  UserResponse,
  UserInput,
  LoginInput,
  AppContext,
  ErrorType,
} from "../types";
import { checkIfUserSessionExist, getToken } from "../utils/jsontoken";
import { QuizResult } from "../entities/QuizResult";
@Resolver(() => User)
export class userResolver {
  @Mutation(() => UserResponse)
  async register(@Arg("input") input: UserInput): Promise<UserResponse> {
    try {
      await registerSchema.validate(input);

      const userExist = await User.findOne({ where: { email: input.email } });
      if (userExist) {
        return {
          error: {
            field: "email",
            message: "User with this email already exit",
          },
        };
      }

      return {
        user: await User.create({
          ...input,
          password: input.password,
          // password: await generateHash(input.password),
        }).save(),
      };
    } catch (error) {
      return {
        error: {
          field: error.path,
          message: error.message || "Internal Server Error",
        },
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("input") input: LoginInput,
    @Ctx() { redis }: AppContext
  ): Promise<UserResponse> {
    try {
      await loginSchema.validate(input);

      const user = await User.findOne({ where: { email: input.email } });

      if (!user) {
        return {
          error: {
            field: "email",
            message: "User with this email does not exit",
          },
        };
      }

      if (user.password !== input.password) {
        return {
          error: {
            field: "password",
            message: "Password is not correct",
          },
        };
      }

      const accessToken = getToken({ id: user.id, email: user.email });

      user.accessToken = accessToken;

      //store user token
      await redis.set(accessToken, accessToken);

      return {
        user,
      };
    } catch (error) {
      return {
        error: {
          field: error.path,
          message: error.message || "Internal Server Error",
        },
      };
    }
  }

  @Mutation(() => UserResponse)
  async logout(@Ctx() { redis, req }: AppContext): Promise<UserResponse> {
    try {
      const isError = checkIfUserSessionExist(req.headers);
      if (isError) {
        return isError;
      }

      const userId = req.headers.userId as string;

      const user = await User.findOne(userId);

      //remove user token
      await redis.del(req.headers.jwtToken as string);

      //remove user games
      redis.del(userId);

      return {
        user,
      };
    } catch (error) {
      return {
        error: {
          field: error.path,
          message: error.message || "Internal Server Error",
        },
      };
    }
  }

  @Query(() => UserResponse, { nullable: true })
  async me(@Ctx() { req }: AppContext): Promise<UserResponse | undefined> {
    try {
      const isError = checkIfUserSessionExist(req.headers);
      if (isError) {
        return isError;
      }

      const user = await User.findOne(req.headers.userId as string);

      return {
        user,
      };
    } catch (error) {
      return {
        error: {
          field: error.path,
          message: error.message || "Internal Server Error",
        },
      };
    }
  }

  @Query(() => User, { nullable: true })
  async getByUsername(
    @Arg("username") username: string
  ): Promise<User | undefined> {
    return User.findOne({ where: { username } });
  }

  @FieldResolver(() => Number, { nullable: true })
  async highestScore(
    @Ctx() { req }: AppContext
  ): Promise<Number | { error: ErrorType } | undefined> {
    const isError = checkIfUserSessionExist(req.headers);
    if (isError) {
      return isError;
    }
    const results = await QuizResult.find({
      where: { user: { id: req.headers.userId } },
    });
    if (!results.length) {
      return 0;
    }
    return (
      results.sort((a, b) => b.noCorrectAnswers - a.noCorrectAnswers)[0]
        .noCorrectAnswers * 10
    );
  }

  @FieldResolver(() => [QuizResult], { nullable: true })
  async quizResult(
    @Ctx() { req }: AppContext
  ): Promise<QuizResult[] | { error: ErrorType } | undefined> {
    const isError = checkIfUserSessionExist(req.headers);
    if (isError) {
      return isError;
    }

    const result = await QuizResult.find({
      where: { user: { id: req.headers.userId } },
    });

    return result.length ? result : [];
  }

  @FieldResolver(() => String, { nullable: true })
  async accessToken(
    @Ctx() { req }: AppContext
  ): Promise<String | { error: ErrorType } | undefined> {
    const isError = checkIfUserSessionExist(req.headers);
    if (isError) {
      return isError;
    }

    return req.headers.jwtToken as string;
  }
}
