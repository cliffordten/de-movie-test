import "reflect-metadata";
import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";

import { openDBConnection } from "./utils/database";
import config from "./constants";
import { createSchema } from "./utils/createSchema";
import { redis } from "./utils/redis";
import { AuthMiddleWare } from "./middlewares";
import { checkHealth } from "./routes/health";
import { getConnectionManager } from "typeorm";
// import { AppContext } from "./types";

const main = async () => {
  let retries = Number(config.dbConnectionRetries);
  const retryTimeout = Number(config.timeoutBeforeRetry);

  while (retries) {
    try {
      const { connections } = getConnectionManager();

      if (!connections.length) {
        const conn = await openDBConnection();
        await conn.synchronize();
        await conn.runMigrations();
      }
      break;
    } catch (error) {
      retries -= 1;
      console.log(error);
      console.log(`retries left: ${retries}`);
      await new Promise((res) => setTimeout(res, retryTimeout));
    }
  }

  redis.on("error", (err) => console.log("Redis Client Error", err));

  const app = express();

  app.use(AuthMiddleWare);
  app.get("/health", checkHealth);

  //set up cors with express cors middlewares
  app.use(
    cors({
      origin: [config.frontend_url, config.studio_apollo_graphql_url],
      credentials: true,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await createSchema(),
    context: ({ req, res }) => ({ req, res, redis }),
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
