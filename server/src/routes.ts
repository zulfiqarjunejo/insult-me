import { Application } from "express";
import InsultRouter from "./insult/router";

export default function routes(app: Application): void {
  app.use("/api/v1/insults", InsultRouter);
}
