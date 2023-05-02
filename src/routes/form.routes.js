import { Router } from "express";
const router = Router();

import * as controllerForm from "../controllers/form.controller.js";

router
  .post("/formBE", controllerForm.formBE)
  .get("/borrar/:id", controllerForm.borrar)
  .get("/pdf/:id", controllerForm.pdfCreate)
  .get("/codigo-de-barras/:status", controllerForm.barcode)
  .post("/barcode-post", controllerForm.barcodePost);

export default router;
