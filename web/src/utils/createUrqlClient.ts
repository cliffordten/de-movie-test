import { cacheExchange } from "@urql/exchange-graphcache";
import { dedupExchange, fetchExchange } from "urql";

import { Cache, QueryInput } from "@urql/exchange-graphcache";
import { GetMeDocument, GetMeQuery, LoginMutation } from "../generated/graphql";

export function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

export const createUrqlClient = (ssrExchange: any) => ({
  url: process.env.NEXT_PUBLIC_BACK_END_URL!,
  credentials: "include",
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result, _args, cache, _info) => {
            betterUpdateQuery<LoginMutation, GetMeQuery>(
              cache,
              { query: GetMeDocument },
              _result,
              (result, query) => {
                if (result.login.error) {
                  return query;
                } else {
                  return {
                    me: {
                      user: result.login.user,
                    },
                  };
                }
              }
            );
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
