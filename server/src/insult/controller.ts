import { Request, Response } from "express";

import UserService from "./service";

export class UserController {
  private service: UserService;

  constructor(service: UserService) {
    this.service = service;
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const insult = await this.service.create();
    res.status(200).send(insult);
  };

  all = async (req: Request, res: Response): Promise<void> => {
    const insults = await this.service.all();
    res.status(200).send(insults);
  };
}

export default UserController;
