import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import flash from "connect-flash";

import authRouter from "./routes/auth.js";
import memberRouter from "./routes/member.js";
import errorRouter from "./routes/error.js";

import oldInput from "./middlewares/oldInput.js";
import bindReqUser from "./middlewares/user.js";
import { csrfProtection, csrfToken } from "./middlewares/csrf.js";

import { rootPath } from "./utils/helpers.js";
import { store } from "./utils/db.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(rootPath("public")));

await mongoose.connect(process.env.MONGO_URI);

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(oldInput);
app.use(csrfProtection);
app.use(flash());
app.use(bindReqUser);
app.use(csrfToken);

app.use(authRouter);
app.use(memberRouter);
app.use(errorRouter);

app.listen(3000, async () => {
  console.log("Server is running on port 3000");
});
