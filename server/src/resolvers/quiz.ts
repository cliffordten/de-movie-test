import { getGameInfo } from "../utils/axios/quiz";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import {
  AppContext,
  ErrorType,
  QuizResponse,
  QuizResultResponse,
  UserQuizResponseInput,
} from "../types";
import { randomUUID } from "crypto";
import { QuizResult } from "../entities/QuizResult";
import { checkIfUserSessionExist } from "../utils/jsontoken";

const imageBaseUrl = "https://image.tmdb.org/t/p/w220_and_h330_face";

@Resolver()
export class quizResolver {
  @Query(() => QuizResponse, { nullable: true })
  async getGameQuestion(
    @Ctx() { req, redis }: AppContext
  ): Promise<QuizResponse | undefined> {
    try {
      const userId = req.headers.userId as string;

      const isError = checkIfUserSessionExist(req.headers);
      if (isError) {
        return isError;
      }

      const gameInfo = await getGameInfo();
      const quizeId = randomUUID();
      const actor = gameInfo.actor;
      const movie = gameInfo.movie;
      const quizAnswer = { id: quizeId, ans: gameInfo.correctAnswer };

      console.log(gameInfo.correctAnswer, gameInfo.even);
      console.log({
        actorName: actor.name,
        movieName: movie.title,
      });

      //store answers to user question in redis
      if (actor.name && movie.title) {
        await redis.rpush(userId, JSON.stringify(quizAnswer));
      }

      return {
        quiz: {
          id: quizeId,
          actor: {
            actorImage: imageBaseUrl + actor.profile_path,
            actorName: actor.name,
          },
          movie: {
            movieImage: imageBaseUrl + movie.poster_path,
            movieName: movie.title,
          },
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
  ): Promise<QuizResultResponse | undefined> {
    try {
      const userId = req.headers.userId as string;

      const isError = checkIfUserSessionExist(req.headers);
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

      const result = await QuizResult.create({ noCorrectAnswers }).save();

      await redis.ltrim(userId, 0, -1);

      console.log(noCorrectAnswers, "noCorrectAnswers");

      return {
        result,
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

  @Query(() => QuizResult)
  async getAllUserGameResults(
    @Ctx() { req }: AppContext
  ): Promise<QuizResult[] | { error: ErrorType } | undefined> {
    try {
      const isError = checkIfUserSessionExist(req.headers);
      if (isError) {
        return isError;
      }

      return QuizResult.find({ where: { user: { id: req.headers.userId } } });
    } catch (error) {
      return {
        error: {
          field: error.path,
          message: error.message || "Internal Server Error",
        },
      };
    }
  }
}
