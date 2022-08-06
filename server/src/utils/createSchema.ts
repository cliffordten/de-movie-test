import { GraphQLSchema } from "graphql";
import { quizResolver } from "../resolvers/quiz";
import { buildSchema } from "type-graphql";
import { userResolver } from "../resolvers/user";

export const createSchema = (): Promise<GraphQLSchema> =>
  buildSchema({
    resolvers: [userResolver, quizResolver],
    validate: false,
  });
