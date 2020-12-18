import { Request, Response } from "express";

import UserService from "./service";
import { createSpan, finishSpanWithResult } from "../helper/jaeger";

export class UserController {
  private service: UserService;

  constructor(service: UserService) {
    this.service = service;
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const traceSpan = createSpan(
      "insult.controller",
      "insult.controller.create",
      req.headers
    );

    const insult = await this.service.create(traceSpan.context());
    if (!insult) {
      res.sendStatus(404);
      finishSpanWithResult(traceSpan, 404);
      return;
    }
    res.status(200).send(insult);
    finishSpanWithResult(traceSpan, 200);
  };

  all = async (req: Request, res: Response): Promise<void> => {
    const traceSpan = createSpan(
      "insult.controller",
      "insult.controller.all",
      req.headers
    );

    const insults = await this.service.all(traceSpan.context());
    if (!insults) {
      res.sendStatus(404);
      finishSpanWithResult(traceSpan, 404);
      return;
    }
    res.status(200).send(insults);
    finishSpanWithResult(traceSpan, 200);
    return;
  };
}

export default UserController;
