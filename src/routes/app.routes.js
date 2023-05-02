import { Router } from "express";
const router = Router();

import * as controllerApp from "../controllers/app.controller.js";

router
  .get("/", controllerApp.login)
  .get("/inicio", controllerApp.inicio)
  .get("/formulario", controllerApp.formulario)
  .get("/facturas", controllerApp.facturas)
  .get("/stock", controllerApp.stock)
  .get("/error", controllerApp.error);

export default router;
