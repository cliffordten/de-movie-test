// import { generateHash } from "../utils/passEncrypt";
import { loginSchema, registerSchema } from "../utils/yup/auth.schema";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { UserResponse, UserInput, LoginInput, AppContext } from "../types";
@Resolver()
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
    @Ctx() { req }: AppContext
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

      req.session.userId = user.id;

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
      const user = await User.findOne(req.session.userId);

      if (!user) {
        return {
          error: {
            field: "session",
            message: "User not logged in",
          },
        };
      }

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
}
