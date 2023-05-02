import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import Stock from "../models/stock.js";
import Formulario from "../models/formulario.js";

export const login = (req, res) => {
  res.render("login", {
    sendAlert: false,
  });
};

export const inicio = (req, res) => {
  if (!req.session.loggedin) {
    res.render("error");
  }

  res.render("inicio");
};

export const formulario = async (req, res) => {
  if (!req.session.loggedin) {
    res.redirect("/error");
  }

  var ruta = path.join(__dirname, "./tools.json");
  var toolsJSON = fs.readFileSync(ruta);
  var toolsData = JSON.parse(toolsJSON);

  Stock.find({}, (err, docs) => {
    const documents = docs;

    res.render("formulario", {
      sendAlert: false,
      success: false,
      estadoStock: 0,
      data: documents,
    });
  });
};

export const facturas = async (req, res) => {
  if (!req.session.loggedin) {
    res.redirect("/error");
  }

  Formulario.find({}, (err, docs) => {
    const data = docs;
    if (data.length > 0) {
      console.log("lleno");
      var estadoDocs = true;
    } else {
      console.log("vacio");
      var estadoDocs = false;
    }
    docs.forEach((element) => {
      const arrTools = element.herramientas;
    });

    res.render("facturas", {
      dataForm: data,
      estado: estadoDocs,
    });
  });
};

export const stock = (req, res) => {
  if (!req.session.loggedin) {
    res.redirect("/error");
  }

  Stock.find({}, (err, doc) => {
    const docs = doc;

    res.render("stock", {
      stockdb: doc,
      alert: 0,
    });
  });
};

export const error = (req, res) => {
  res.render("error");
};
