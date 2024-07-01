import mongoose, { Schema } from "mongoose";

// Définir le schéma pour le modèle "Training" avec les champs et leurs types
const trainingSchema = new Schema(
  {
    title: String
  },
  {
    timestamps: true
  }
);

export const trainingModel = mongoose.model("Training", trainingSchema);
