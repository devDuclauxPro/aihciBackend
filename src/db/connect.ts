import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import { exit } from "process";

// Chargement des variables d'environnement depuis le fichier .env
configDotenv({ path: "./src/config/.env" });

// Fonction pour se connecter à la base de données
export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.URI!, {
      autoIndex: process.env.NODE_ENV !== "production"
    });
  } catch (error) {
    throw error;
  }
};

// Appel de la fonction pour se connecter à la base de données au chargement de l'application
connectToDatabase()
  .then(() => {
    console.log("Connected to DB successfully");
  })
  .catch((error) => {
    console.error("Error connecting to DB:", error);
    exit(1);
  });
