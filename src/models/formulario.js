import mongoose from "mongoose";
const { Schema, model } = mongoose;

const FormularioSchema = new Schema({
  alumno: { type: String, required: true },
  docente: { type: String, required: true },
  especialidad: { type: String, required: true },
  curso: { type: String, required: true },
  division: { type: String, required: true },
  herramientas: { type: Object, required: true },
  hours: { type: String, required: false },
});

export default model("formulario", FormularioSchema);
