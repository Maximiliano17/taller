import Stock from "../models/stock.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const stockInfo = (req, res) => {
  const name = req.params.tool;

  Stock.find({ name: name }, (err, docs) => {
    const data = docs;

    data.forEach((element) => {
      console.log(element.name + " " + element.total);
    });

    res.render("tool-info", {
      data: data,
    });
  });
};

export const stockDelete = async (req, res) => {
  const id = req.params.id;

  var ruta = path.join(__dirname, "./tools.json");
  var toolsJSON = fs.readFileSync(ruta);
  var toolsData = JSON.parse(toolsJSON);

  if (id > 0 && id >= toolsData.length) {
    console.log("mi id es: " + id);

    const DeleteOne = await Stock.deleteOne({
      identificador: id,
    });

    const arr = toolsData;

    const result = arr.filter((tool) => tool.id != id);

    fs.writeFileSync(ruta, JSON.stringify(result), "utf-8");

    console.log(result);
  } else {
    console.log("NO Se Puede Borrar Esta Herarmienta... ");

    // const DeleteOne = await Stock.deleteOne(
    //     {
    //     identificador: id
    //     }
    // );

    // const arr = toolsData;

    // const result = arr.filter(tool => tool.id != id);

    // fs.writeFileSync(ruta, JSON.stringify(result), 'utf-8');

    //     result.forEach(element => {
    //         if(element.id != 1) {
    //             element.id = element.id - 1;
    //         }

    //       });

    //         fs.writeFileSync(ruta, JSON.stringify(result), 'utf-8');
    //       const resta = 1;

    //       Stock.update({},
    //         {$inc: {identificador: - resta} }, function (err, docs) {
    //         if (err){
    //             console.log(err);

    //         }
    //         else{
    //             console.log("Updated Docs : ", docs);
    //         }
    //       })
  }

  //     Stock.update({identificador: 0}, {identificador: 1});

  res.redirect("/stock");
};

export const add = (req, res) => {
  if (!req.session.loggedin) {
    res.redirect("/error");
  }

  res.render("agregar-herramienta");
};

export const editTool = (req, res) => {
  var ruta = path.join(__dirname, "./tools.json");

  var pathJSON = path.join(ruta);
  var CodeJSON = fs.readFileSync(pathJSON);
  var GetJSON = JSON.parse(CodeJSON);

  let herramientaParam = req.params.name;

  let herramienta = req.body.herramienta;

  let stockParam = req.body.stock;

  let codigo = req.body.codigo;

  let file = req.body.file;

  if (stockParam > 0 && herramienta != "" && herramienta.length >= 4) {
    Stock.updateOne(
      { name: req.params.name },
      { total: stockParam, stock: stockParam, name: herramienta },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          var arrJSON = new Array();

          console.log("Updated Docs : ", docs);

          GetJSON.forEach((element) => {
            let toolUpper = herramientaParam.slice(0, 1).toUpperCase();

            let toolLower = herramientaParam
              .slice(1, herramientaParam.length)
              .toLowerCase();

            let toolEnd = toolUpper + toolLower;

            // console.log("====================================================");
            // console.log("element nombre: " + element.nombre);
            // console.log("herramienta actual: " + toolEnd);
            // console.log("====================================================");

            arrJSON.push(element);

            if (element.nombre == toolEnd) {
              console.log("encontre la herramienta" + element.nombre);

              let toolUpper = herramienta.slice(0, 1).toUpperCase();

              let toolLower = herramienta
                .slice(1, herramienta.length)
                .toLowerCase();

              let toolEnd = toolUpper + toolLower;

              element.nombre = toolEnd;

              element.imagen = herramienta + ".png";
            }
          });

          fs.writeFileSync(ruta, JSON.stringify(arrJSON), "utf-8");

          console.log("Updated Docs : ", docs);
        }
      }
    );
  }

  if (stockParam > 0) {
    Stock.updateOne(
      { name: req.params.name },
      { total: stockParam, stock: stockParam },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated Docs : ", docs);
        }
      }
    );
  }

  if (herramienta != "" && herramienta.length >= 4) {
    Stock.updateOne(
      { name: req.params.name },
      { name: herramienta },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          var arrJSON = new Array();

          console.log("Updated Docs : ", docs);

          GetJSON.forEach((element) => {
            let toolUpper = herramientaParam.slice(0, 1).toUpperCase();

            let toolLower = herramientaParam
              .slice(1, herramientaParam.length)
              .toLowerCase();

            let toolEnd = toolUpper + toolLower;

            // console.log("====================================================");
            // console.log("element nombre: " + element.nombre);
            // console.log("herramienta actual: " + toolEnd);
            // console.log("====================================================");

            arrJSON.push(element);

            if (element.nombre == toolEnd) {
              console.log("encontre la herramienta" + element.nombre);

              let toolUpper = herramienta.slice(0, 1).toUpperCase();

              let toolLower = herramienta
                .slice(1, herramienta.length)
                .toLowerCase();

              let toolEnd = toolUpper + toolLower;

              element.nombre = toolEnd;

              element.imagen = herramienta + ".png";
            }
          });

          fs.writeFileSync(ruta, JSON.stringify(arrJSON), "utf-8");
        }
      }
    );
  }

  res.redirect("/stock");
};
