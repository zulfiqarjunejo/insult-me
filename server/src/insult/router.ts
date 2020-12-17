import express from "express";

import Controller from "./controller";
import Service from "./service";

const controller: Controller = new Controller(new Service());

export default express
  .Router()
  .post("/", controller.create)
  .get("/", controller.all);
