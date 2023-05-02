import { Router } from "express";
const router = Router();

import * as controllerTools from "../controllers/tools.controller.js";

router
  .get("/add", controllerTools.add)
  .get(
    "/codigo-de-barras/herramientas/:id/:estado/:tool/:n", controllerTools.addTools)
  .post("/send", controllerTools.sendTool)
  .post("/herramientas-post/:id", controllerTools.herramientasPost)

export default router;
