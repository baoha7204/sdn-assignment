import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import flash from "connect-flash";

import authRouter from "./routes/auth.route.js";
import memberRouter from "./routes/member.route.js";
import errorRouter from "./routes/error.route.js";
import publicRouter from "./routes/public.route.js";
import adminRouter from "./routes/admin.route.js";

import oldInputMiddleware from "./middlewares/oldInput.middleware.js";
import bindReqUserMiddleware from "./middlewares/user.middleware.js";
import isAuthMiddleware from "./middlewares/is-auth.middleware.js";
import isAdminMiddleware from "./middlewares/is-admin.middleware.js";

import { rootPath } from "./utils/helpers.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(rootPath("public")));

await mongoose.connect(process.env.MONGO_URI);

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.JWT_SECRET],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  })
);

app.use(oldInputMiddleware);
app.use(flash());
app.use(bindReqUserMiddleware);

app.use(publicRouter);
app.use(authRouter);
app.use("/admin", isAuthMiddleware, isAdminMiddleware, adminRouter);
app.use("/member", isAuthMiddleware, memberRouter);
app.use(errorRouter);

app.listen(3000, async () => {
  console.log("Server is running on port 3000");
});
