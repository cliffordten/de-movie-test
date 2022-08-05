import Redis from "ioredis";
import config from "../constants";

export const redis = new Redis({
  port: +config.redisPort, // Redis port
  host: config.redisHost, // Redis host
});
