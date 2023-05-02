import mongoose from "mongoose";

const user = 'JuampaVLB';

const password = 'KuFKcWq2bhcF8RCQ';

const dbname = 'escuela';

const URI = `mongodb+srv://${user}:${password}@cluster0.ktoxf8e.mongodb.net/${dbname}`;

// Local
// mongodb://0.0.0.0:27017/escuela

mongoose
  .connect(URI)
  .then(() => console.log("BASE DE DATOS CONECTADA!"))
  .catch((e) => console.log(e));
