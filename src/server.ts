import { configDotenv } from "dotenv";
import express, { type Express } from "express";
import { connectToDatabase } from "./db/connect";
import { routeUserApi } from "./routes/users.routes";

// Configuration de dotenv
configDotenv({ path: "./src/config/.env" });

// Connexion à la base de données

// Port du serveur
const port: number = Number(process.env.PORT) || 3000;

// Création de l'application Express
const app: Express = express();

// Middleware pour parser les requêtes JSON et URL encodées
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use("/api", routeUserApi);

// Démarrage du serveur
app.listen(port, () => {
  console.log("Serveur is running in", port);
  //eslint-disable-next-line @typescript-eslint/no-unused-expressions
  connectToDatabase;
});
