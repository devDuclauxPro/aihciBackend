import mongoose, { Schema } from "mongoose";

// Définir le schéma pour le modèle "Article" avec les champs et leurs types
const articleSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    content: String,
    author: { type: String, required: true }
  },
  { timestamps: true }
);

export const articleModel = mongoose.model("Article", articleSchema);
