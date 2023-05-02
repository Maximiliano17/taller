import { Router } from "express";
import multer from "multer";

const router = Router();
import * as stockController from "../controllers/stock.controller.js";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img/tools");
  },
  filename: (req, file, cb) => {
    let param = req.params.name;
    let nameFile = file.originalname;
    cb(null, `${param}.png`);
  },
});

const upload = multer({ storage });

router
  .get("/info/:tool", stockController.stockInfo)
  .get("/delete/:id", stockController.stockDelete)
  .get("/add", stockController.add)
  .post("/edit/send/:name", upload.single("imgTool"), stockController.editTool);

export default router;
