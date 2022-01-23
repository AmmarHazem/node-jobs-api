require("dotenv").config();
require("express-async-errors");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const connectDB = require("./db/connect");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authenticationMiddleware = require("./middleware/authentication");
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const { response } = require("express");

const app = express();
app.set("trust proxy", 1);
app.get("/ip", (request, response) => response.send(request.ip));
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    store: new MemoryStore(),
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
// extra packages

// routes
app.get("/", (request, response) => response.send("Jobs API"));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticationMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    console.log("Connecting to DB");
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
