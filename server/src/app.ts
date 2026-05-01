import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connDB } from "./utils/connDB.js";
import userRouter from "./routers/user.routers.js";
import authRouter from "./routers/auth.routers.js";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

if (process.env.NODE_ENV === "production") {
  app.use(limiter);
}

console.log("CLIENT_URL:", process.env.CLIENT_URL);

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["POST", "GET", "DELETE", "PATCH", "PUT"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  console.log("This is the server");
  return res.send("Hello World")
})

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error"
  });
});

async function startServer() {
  try {
    await connDB();

    const server = app.listen(PORT, () => {
      console.log(`App running at port ${PORT}`);
    });

    process.on("SIGINT", () => {
      server.close(() => process.exit(0));
    });

  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
}

startServer();