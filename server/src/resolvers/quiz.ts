import { getGameInfo } from "../utils/axios/quiz";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import {
  AppContext,
  ErrorType,
  PreviousQuizResponseInput,
  QuizResponse,
  QuizResultResponse,
  UserQuizResponseInput,
  UserResultResponse,
} from "../types";
import { randomUUID } from "crypto";
import { QuizResult } from "../entities/QuizResult";
import { checkIfUserSessionExist } from "../utils/jsontoken";
import { User } from "../entities/User";
import config from "../constants";

@Resolver(QuizResult)
export class quizResolver {
  @Query(() => QuizResponse, { nullable: true })
  async getGameQuestion(
    @Arg("input", () => PreviousQuizResponseInput)
    input: PreviousQuizResponseInput,
    @Ctx() { req, redis }: AppContext
  ): Promise<QuizResponse> {
    try {
      const userId = req.headers.userId as string;

      const isError = checkIfUserSessionExist(req.headers, req.body.query);
      if (isError) {
        return isError;
      }

      //get correct answers
      const userQuestions = await redis.lrange(userId, 0, -1);
      let lastQuestionId = undefined;

      if (!input.prevQuestionId && userQuestions.length) {
        return {
          error: {
            field: "game",
            message: "Last question id is required",
          },
          game: {
            isGameOver: false,
            noQuestionAnswered: userQuestions.length,
            lastQuestionId,
          },
        };
      }

      // check if previous question is correct
      if (input.prevQuestionId) {
        const correctAnswers = userQuestions.map((item) => JSON.parse(item));
        const lastQuizAnswer = correctAnswers[correctAnswers.length - 1];
        lastQuestionId = lastQuizAnswer.id;

        if (input.prevQuestionId !== lastQuizAnswer.id) {
          return {
            error: {
              field: "game",
              message: "Last question id is not correct",
            },
            game: {
              isGameOver: false,
              noQuestionAnswered: userQuestions.length,
              lastQuestionId,
            },
          };
        }

        if (input.response !== lastQuizAnswer.ans) {
          return {
            error: {
              field: "game",
              message:
                "Game Over!! Last Question response is not correct, get game results to terminate the game.",
            },
            game: {
              isGameOver: true,
              noQuestionAnswered: userQuestions.length,
            },
          };
        }
      }

      const gameInfo = await getGameInfo();
      const quizeId = randomUUID();
      const actor = gameInfo.actor;
      const movie = gameInfo.movie;
      const quizAnswer = { id: quizeId, ans: gameInfo.correctAnswer };

      //store answers to user question in redis
      if (actor.name && (movie.title || movie.name)) {
        await redis.rpush(userId, JSON.stringify(quizAnswer));
      }

      return {
        quiz: {
          id: quizeId,
          actor: {
            actorImage: config.imageBaseUrl + actor.profile_path,
            actorName: actor.name,
          },
          movie: {
            movieImage: config.imageBaseUrl + movie.poster_path,
            movieName: movie.title || movie.name,
          },
        },
        game: {
          isGameOver: false,
          noQuestionAnswered: userQuestions.length,
          lastQuestionId,
        },
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

  @Mutation(() => QuizResultResponse)
  async getUserCurrentGameResults(
    @Arg("input", () => [UserQuizResponseInput]) input: UserQuizResponseInput[],
    @Ctx() { req, redis }: AppContext
  ): Promise<QuizResultResponse> {
    try {
      const userId = req.headers.userId as string;

      const isError = checkIfUserSessionExist(req.headers, req.body.query);
      if (isError) {
        return isError;
      }

      let noCorrectAnswers = 0;

      //get correct answers
      const userQuestions = await redis.lrange(userId, 0, -1);

      if (!userQuestions.length) {
        return {
          error: {
            field: "game",
            message: "User has no current games, Start game to see result",
          },
        };
      }

      const correctAnswers = userQuestions.map((item) => JSON.parse(item));

      correctAnswers.forEach((question) => {
        const userResponse = input.find(
          (item) => item.questionId == question.id
        );
        if (userResponse?.response == question.ans) {
          noCorrectAnswers++;
        }
      });

      await redis.del(userId);

      return {
        result: await QuizResult.create({
          noCorrectAnswers,
          totalAnsweredQuestions: input.length,
          userId,
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

  @Query(() => UserResultResponse, { nullable: true })
  async getAllUserGameResults(
    @Ctx() { req }: AppContext
  ): Promise<UserResultResponse> {
    try {
      const isError = checkIfUserSessionExist(req.headers, req.body.query);
      if (isError) {
        return isError;
      }

      const result = await QuizResult.find({
        where: { user: { id: req.headers.userId } },
      });

      return { result: result.length ? result : [] };
    } catch (error) {
      return {
        error: {
          field: error.path,
          message: error.message || "Internal Server Error",
        },
      };
    }
  }

  @FieldResolver(() => User, { nullable: true })
  async user(
    @Ctx() { req }: AppContext
  ): Promise<User | { error: ErrorType } | undefined> {
    const isError = checkIfUserSessionExist(req.headers, req.body.query);
    if (isError) {
      return isError;
    }

    const userId = req.headers.userId as string;

    return User.findOne(userId);
  }
}
