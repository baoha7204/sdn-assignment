import MongoStore from "connect-mongo";
import { configDotenv } from "dotenv";

configDotenv();

export const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: "sessions",
});
