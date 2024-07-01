import mongoose, { Schema } from "mongoose";

// Définir le schéma pour le modèle "Document" avec les champs et leurs types
const documentSchema = new Schema(
  {
    title: String,
    type: String,
    file: String
  },
  {
    timestamps: true
  }
);

export const documentModel = mongoose.model("Document", documentSchema);
