import Stock from "../models/stock.js";
import Formulario from '../models/formulario.js';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const add = (req, res) => {
  if (!req.session.loggedin) {
    res.redirect("/error");
  }

  res.render("agregar-herramienta");
};

export const sendTool = (req, res) => {
  var ruta = path.join(__dirname, "./tools.json");
  var toolsJSON = fs.readFileSync(ruta);
  var toolsData = JSON.parse(toolsJSON);

  var newJSON = toolsData;

  var identificador = toolsData.length + 1;

  var herramienta = req.body.herramienta;

  var stock = req.body.stock;

  function CreateTool() {
    if (herramienta.length > 0 && stock > 0) {
      let letter = herramienta.charAt(0).toUpperCase();

      let slice = herramienta.slice(1);

      let herramientaUpperCase = letter + slice;

      let min = 1000000000000;

      let max = 9999999999999;

      let code = Math.floor(Math.random() * (max - min + 1) + min);

      var newData = {
        id: identificador,
        nombre: herramientaUpperCase,
        imagen: `${herramienta}.png`,
        codigo: code,
      };

      var Convert = JSON.stringify(newData);

      newJSON.push(newData);

      console.log(newJSON);

      fs.writeFileSync(ruta, JSON.stringify(newJSON), "utf-8");

      Stock.create({
        name: herramienta,
        stock: stock,
        identificador: identificador,
        total: stock,
        codebar: code,
      });

      console.log("HERRAMIENTA CREADA");

      Stock.find({}, (err, doc) => {
        const docs = doc;

        res.render("stock", {
          stockdb: doc,
          alert: 1,
          herramienta: herramienta,
        });
      });
    } else {
      console.log("HERRAMIENTA NO CREADA");
      Stock.find({}, (err, doc) => {
        const docs = doc;

        res.render("stock", {
          stockdb: doc,
          alert: 2,
          herramienta: herramienta,
        });
      });
    }
  }

  const arrTools = new Array();

  toolsData.forEach((element) => {
    arrTools.push(element.nombre);
  });

  let letter = herramienta.charAt(0).toUpperCase();

  let slice = herramienta.slice(1);

  let herramientaUpperCase = letter + slice;

  const verificacion = arrTools.includes(herramientaUpperCase);

  console.log(verificacion);

  if (verificacion) {
    console.log("La herramienta Ya existe");

    Stock.find({}, (err, doc) => {
      const docs = doc;

      res.render("stock", {
        stockdb: doc,
        alert: 2,
        herramienta: herramienta,
      });
    });
  } else {
    CreateTool();
  }
};

export const addTools = (req, res) => {
  console.log(req.params.id);

  let idUser = req.params.id;

  let estado = req.params.estado;

  let toolParams = req.params.tool;

  let cantParams = req.params.n;

  console.log("estado: " + estado);

  res.render("agregar", {
    id: idUser,
    estado: estado,
    tool: toolParams,
    cant: cantParams,
  });
};

export const herramientasPost = (req, res) => {
  var pathJSON = path.join(__dirname, "./tools.json");
  var CodeJSON = fs.readFileSync(pathJSON);
  var GetJSON = JSON.parse(CodeJSON);

  var contadorCode = 0;

  GetJSON.forEach(async (element) => {
    var idUpdate = req.params.id;

    let upc = element.codigo;

    let toolName = element.nombre;

    let idJSON = element.id;

    let codigoForm = req.body.codigo;

    let cantForm = req.body.cantidad;

    if (upc == codigoForm) {
      Stock.find({ identificador: idJSON }, async (err, docs) => {
        const document = docs;

        console.log(document[0].stock);

        if (cantForm <= document[0].stock) {
          const filter = { _id: idUpdate };

          const update = {
            herramientas: [
              { nombre: toolName, cantidad: cantForm, id: idJSON },
            ],
          };

          console.log(
            `
              ----------------------------------
  
              Codigo Formulario: ${codigoForm}
              
              Codigo JSON: ${upc}
              
              Nombre: ${toolName}
              
              Cantidad: ${cantForm}
  
              id de la herramienta: ${idJSON}
              
              id del usuario: ${idUpdate}
              
              -----------------------------------
              `
          );

          const oldDocument = await Formulario.updateOne(filter, {
            $push: update,
          });
          const stockUpdate = await Stock.updateOne(
            { identificador: idJSON },
            {
              $inc: { stock: -cantForm },
            }
          );

          console.log("actualize la id numero: " + idJSON);

          res.redirect(
            `/api/tools/codigo-de-barras/herramientas/${idUpdate}/success/${toolName}/0`
          );
        } else if (document[0].stock === 0) {
          console.log("No hay mas stock, esta en 0");
          res.redirect(
            `/api/tools/codigo-de-barras/herramientas/${idUpdate}/errorSinStock/${toolName}/0`
          );
        } else {
          let response = new Array();

          response.push(toolName, document[0].stock);

          console.log("estas pidiendo mas de lo que hay: " + document[0].stock);

          console.log("array: " + response);

          res.redirect(
            `/api/tools/codigo-de-barras/herramientas/${idUpdate}/errorStock/${toolName}/${document[0].stock}`
          );
        }
      });
    } else {
      contadorCode++;
    }
    if (contadorCode === GetJSON.length) {
      res.redirect(
        `/api/tools/codigo-de-barras/herramientas/${idUpdate}/error/empty/empty`
      );
    }
  });
};
