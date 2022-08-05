import "reflect-metadata";
import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";

import { openDBConnection } from "./utils/database";
import config from "./constants";
import { createSchema } from "./utils/createSchema";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
// import { AppContext } from "./types";

const main = async () => {
  let retries = Number(config.dbConnectionRetries);
  const retryTimeout = Number(config.timeoutBeforeRetry);

  while (retries) {
    try {
      const conn = await openDBConnection();
      await conn.synchronize();
      await conn.runMigrations();
      break;
    } catch (error) {
      retries -= 1;
      console.log(error);
      console.log(`retries left: ${retries}`);
      await new Promise((res) => setTimeout(res, retryTimeout));
    }
  }

  const RedisStore = connectRedis(session);
  const redis = new Redis({
    port: +config.redisPort, // Redis port
    host: config.redisHost, // Redis host
  });

  redis.on("error", (err) => console.log("Redis Client Error", err));

  const app = express();
  //manage session with redis
  app.use(
    session({
      store: new RedisStore({ client: redis, disableTouch: true }),
      secret: config.secret,
      resave: false,
      name: "DEMOVIE",
      cookie: {
        maxAge: 24 * 3600 * 1000, // 24 hours
        httpOnly: true,
        secure: config.isProd,
        sameSite: "lax", // csrf
      },
      saveUninitialized: false,
    })
  );

  //set up cors with express cors middlewares
  app.use(
    cors({
      origin: [config.frontend_url, config.studio_apollo_graphql_url],
      credentials: true,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await createSchema(),
    context: ({ req, res }) => ({ req, res }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(config.port, () => {
    console.log(`server started on port ... ${config.port}`);
  });
};

main().catch((err) => {
  console.log(err);
});
