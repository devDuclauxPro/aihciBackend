import mongoose, { Schema } from "mongoose";

// Définir le schéma pour le modèle "User" avec les champs et leurs types
const userSchema = new Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    profession: { type: String, required: true },
    city: { type: String, required: true },
    contact: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true }
  },
  { timestamps: true }
);

export const userModel = mongoose.model("User", userSchema);
