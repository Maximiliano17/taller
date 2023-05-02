import mongoose from "mongoose";
const { Schema, model } = mongoose;

const accountSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default model("usuarios", accountSchema);
