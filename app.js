const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const boolParser = require("express-query-boolean");
const helmet = require("helmet");
const { StatusCode } = require("./config/constants");
const contactsRouter = require("./routes/contacts/contacts");
const usersRouter = require("./routes/users/users");


const NOT_FOUND = StatusCode.NOT_FOUND;
const INTERNAL_SERVER_ERROR = StatusCode.INTERNAL_SERVER_ERROR;

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 10000 }));
app.use(boolParser());

app.use((req, _res, next) => {
  app.set("lang", req.acceptsLanguages(["en", "ru"]));
  next();
});

app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((_req, res) => {
  res
    .status(NOT_FOUND)
    .json({ status: "error", code: NOT_FOUND, message: "Not found!" });
});

app.use((err, _req, res, _next) => {
  res.status(INTERNAL_SERVER_ERROR).json({
    status: "fail",
    code: INTERNAL_SERVER_ERROR,
    message: err.message,
  });
});

module.exports = app;