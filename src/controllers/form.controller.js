import mongoose from "mongoose";
import fs from "fs";
import PDF from "pdfkit";
import Formulario from "../models/formulario.js";
import Historial from "../models/historial.js";
import Stock from "../models/stock.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var status = false;

// POST Formulario

export const formBE = (req, res) => {
  var ruta = path.join(__dirname, "/tools.json");
  var toolsJSON = fs.readFileSync(ruta);
  var toolsData = JSON.parse(toolsJSON);

  var errorStock;

  // array de herramientas inicial
  var valuesArr = new Array();

  // array de herramientas final
  var herramientas = new Array();

  // array de todos los datos
  var datos = new Array();

  var contador = 0;
  let i = 0;

  const alumno = req.body.alumno;
  const docente = req.body.docente;
  const especialidad_op = req.body.especialidad_op;
  const year_op = req.body.year_op;
  const year_div_op = req.body.year_div_op;

  const tools = req.body.tools;

  // FOREACH Para Iterar Todas Las Herramientas

  tools.forEach((value) => {
    i++;

    if (value > 0) {
      console.log(i + " - " + value);

      // Guardar en un array los valores mayores 0, pasandole la cantidad(value) y la id(espacio)

      valuesArr.push({ cantidad: value, id: i });
    }
  });

  // FOREACH Para Iterrar Todas Las Herramientas > 0

  valuesArr.forEach((element) => {
    // FOR para iterar el JSON
    console.log("iteracion");
    for (let indice = 0; indice < toolsData.length; indice++) {
      if (toolsData[indice].id === element.id) {
        let nombre = toolsData[indice].nombre;
        let cantidad = element.cantidad;
        let id = element.id;

        herramientas.push({ nombre: nombre, cantidad: cantidad, id: id });

        contador++;
      }
    }
  });

  if (herramientas.length > 0) {
    datos.push({
      alumno: alumno,
      docente: docente,
      especialidad: especialidad_op,
      curso: year_op,
      division: year_div_op,
      herramientas: [],
    });

    datos[0].herramientas.push(herramientas);

    console.log("HERRAMIENTAS AGREGADAS");

    if (
      alumno &&
      docente &&
      especialidad_op != "- -" &&
      year_op != "- -" &&
      year_div_op != "- -"
    ) {
      console.log("INFORMACION ENVIADA A LA BASE DE DATOS");

      Stock.find({}, (err, data) => {
        const stockdb = data;

        var cantToolsArr = new Array();

        var idToolsArr = new Array();

        var estadoError = true;

        var numberC = 0;

        herramientas.forEach((herramienta) => {
          let idTools = herramienta.id;

          let cantTools = herramienta.cantidad;

          cantToolsArr.push(cantTools);

          idToolsArr.push(idTools);

          stockdb.forEach((stockdb) => {
            let identificador = stockdb.identificador;

            if (identificador === idTools) {
              console.log("stock es de: " + stockdb.stock);

              if (stockdb.stock <= 0) {
                console.log("lo siento no hay mas de " + stockdb.name);

                estadoError = false;

                numberC--;
                console.log("stockdb name: " + stockdb);

                Stock.find({}, (err, docs) => {
                  const documents = docs;

                  res.render("formulario", {
                    sendAlert: true,
                    success: false,
                    estadoStock: 2,
                    herramienta: stockdb.name,
                    data: documents,
                  });
                });
              }

              if (cantTools <= stockdb.stock) {
                console.log("estodo error " + estadoError);

                if (estadoError != false) {
                  numberC++;

                  let toolgth = herramientas.length;

                  if (herramientas.length === numberC) {
                    Formulario.create({
                      alumno: datos[0].alumno,
                      docente: datos[0].docente,
                      especialidad: datos[0].especialidad,
                      curso: datos[0].curso,
                      division: datos[0].division,
                      herramientas: datos[0].herramientas,
                      hours: new Date(),
                    });

                    Historial.create({
                      alumno: datos[0].alumno,
                      docente: datos[0].docente,
                      especialidad: datos[0].especialidad,
                      curso: datos[0].curso,
                      division: datos[0].division,
                      herramientas: datos[0].herramientas,
                      hours: new Date(),
                    });

                    console.log("array de: " + cantToolsArr);

                    for (let index = 0; index < cantToolsArr.length; index++) {
                      Stock.updateOne(
                        { identificador: idToolsArr[index] },
                        { $inc: { stock: -cantToolsArr[index] } },
                        function (err, docs) {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log("Updated Docs : ", docs);
                          }
                        }
                      );
                    } // fin for

                    Stock.find({}, (err, docs) => {
                      const documents = docs;

                      res.render("formulario", {
                        sendAlert: false,
                        success: true,
                        estadoStock: 0,
                        herramienta: stockdb.name,
                        data: documents,
                      });
                    });
                  } // fin if length herramientas
                }
              } else {
                console.log(
                  "estas pidiendo mas de lo que hay formulario manual"
                );

                Stock.find({}, (err, docs) => {
                  const documents = docs;

                  res.render("formulario", {
                    sendAlert: true,
                    success: false,
                    estadoStock: 1,
                    herramienta: stockdb.name,
                    data: documents,
                  });

                  // console.log(documents[1].name);
                });
              }
            }
          });
        });
      });

      console.log(status);
    } else {
      console.log("INFORMACION INCORRECTA");

      Stock.find({}, (err, docs) => {
        const documents = docs;

        res.render("formulario", {
          sendAlert: true,
          success: false,
          estadoStock: 0,
          herramienta: "",
          data: documents,
        });
      });
    }
  } else {
    console.log("NO HAY HERRAMIENTAS");

    Stock.find({}, (err, docs) => {
      const documents = docs;

      res.render("formulario", {
        sendAlert: true,
        success: false,
        estadoStock: 0,
        herramienta: "",
        data: documents,
      });
    });
  }
};

// DELETE Pedido

export const borrar = async (req, res) => {
  if (req.params.id) {
    Formulario.find(
      { _id: mongoose.Types.ObjectId(req.params.id) },
      (err, data) => {
        console.log("FACTURA ENCONTRADA");

        const document = data;

        document.forEach((element) => {
          document[0].herramientas.forEach((element) => {
            element.map(function (tool) {
              let toolName = tool.nombre;

              let toolId = tool.id;

              let toolCant = tool.cantidad;

              console.log(
                "nombre: " +
                  toolName +
                  " ID: " +
                  toolId +
                  " Cantidad: " +
                  toolCant
              );

              Stock.find({ identificador: toolId }, (err, data) => {
                console.log(
                  "encontre la herramienta de " + toolName + " En stockDB"
                );

                Stock.updateOne(
                  { identificador: toolId },
                  { $inc: { stock: +toolCant } },
                  function (err, docs) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("Stock de " + toolName + " actualizado.");
                    }
                  }
                );
              });
            });
          });
        });
      }
    );

    const DeleteOne = await Formulario.deleteOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
  }

  res.redirect("/facturas");
};

// PFMAKE

export const pdfCreate = async (req, res) => {
  console.log(req.params.id);

  Formulario.find({ _id: req.params.id }, (err, doc) => {
    const data4 = doc;

    var doc = new PDF({ font: "Times-Bold" });
    //const doc = new PDFDocument({font: 'Courier'});
    var file = doc.pipe(
      fs.createWriteStream(
        __dirname + "../../../public/pdfs/factura-de-taller.pdf"
      )
    );

    let rutaImg = __dirname + "../../../public/img/logo.png";

    doc.image(rutaImg, 430, 15, {
      fit: [100, 100],
      align: "center",
      valign: "center",
    });

    doc.fontSize(18).text("Factura", {
      align: "center",
      underline: true,
    });

    doc.fontSize(15).text(`
        Alumno: ${data4[0].alumno}
        Profesor: ${data4[0].docente}
        Curso: ${data4[0].curso}
        Division: ${data4[0].division}
        Especialidad: ${data4[0].especialidad}
    `);

    doc.fontSize(18).text(`Herramientas`, {
      underline: true,
      align: "center",
    });

    data4[0].herramientas.forEach((element, test) => {
      for (let index = 0; index < element.length; index++) {
        if (index == 4) {
          doc.addPage();
        }

        doc.fontSize(15).text(
          `
            Herramienta: ${element[index].nombre}        |        Cantidad: ${element[index].cantidad}
          `,
          {
            columnGap: 15,
            height: 100,
            width: 465,
            align: "left",
          }
        );
      }
    });

    doc.end();

    res.redirect("/pdfs/factura-de-taller.pdf");
  });
};

// GET Barcode

export const barcode = (req, res) => {
  if (!req.session.loggedin) {
    res.redirect("/error");
  }

  res.render("lector-de-barras", {
    status: req.params.status,
  });
};

// POST Barcode

export const barcodePost = (req, res) => {
  let alumno = req.body.alumno;
  let docente = req.body.docente;
  let especialidad = req.body.especialidad_op;
  let curso = req.body.year_op;
  let division = req.body.year_div_op;

  if (especialidad === "- -" || curso === "- -" || division === "- -") {
    res.redirect("codigo-de-barras/error");
  } else {
    Formulario.create({
      alumno: alumno,
      docente: docente,
      especialidad: especialidad,
      curso: curso,
      division: division,
      herramientas: [],
      hours: new Date(),
    });

    Historial.create(
      {
        alumno: alumno,
        docente: docente,
        especialidad: especialidad,
        curso: curso,
        division: division,
        herramientas: [],
        hours: new Date(),
      },
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          Formulario.findOne({}, (err, data) => {
            const document = data;

            let docId = document.id;

            res.redirect(
              `/api/tools/codigo-de-barras/herramientas/${docId}/empty/empty/empty
              `
            );
          }).sort({ $natural: -1 });
        }
      }
    );
  }
};
