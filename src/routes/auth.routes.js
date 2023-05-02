import { Router } from "express";
const router = Router();

import * as controllerAuth from "../controllers/auth.controller.js";

router.post("/", controllerAuth.auth).get("/logout", controllerAuth.logout);

export default router;
