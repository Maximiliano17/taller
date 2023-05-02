import mongoose from "mongoose";
const { Schema, model } = mongoose;

const stockSchema = new Schema(
  {
    name: { type: String, required: true },
    stock: { type: Number, required: true },
    identificador: { type: Number, required: true },
    total: { type: Number, required: false },
    codebar: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("stock", stockSchema);
