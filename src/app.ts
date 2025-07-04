import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import booksRoute from "./app/routes/books.route";
import borrowRoute from "./app/routes/borrow.route";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL as string],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("This is a server for a library management system");
});
app.get("/api/ping", (_req: Request, res: Response) => {
  res.json({ message: "This server was pinged so here's the pong" });
});
app.use("/api/books", booksRoute);
app.use("/api/borrow", borrowRoute);

app.use(/(.*)/, (_req: Request, _res: Response, next: NextFunction) => {
  next(createHttpError(404, "endpoints not found"));
});

// Error handler
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let errorStatus = 500;
  let errorMessage = "Unknown error has occurred";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let errorDetails: any = null;

  if (isHttpError(error)) {
    errorStatus = error.status;
    errorMessage = error.message;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errorDetails = error.errorDetails as any;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  console.error(`[ERROR ${errorStatus}]`, errorMessage);

  res.status(errorStatus).json({
    message: errorMessage,
    success: false,
    error: errorDetails,
  });
});

export default app;
