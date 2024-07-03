import express, { type Router } from "express";
import {
  deleteOneUser,
  getAllUsers,
  getOneUser,
  postConnectedUsers,
  postCreatedUsers,
  updateOneUser
} from "../controllers/users";

// Création du routeur Express
export const routeUserApi: Router = express.Router();

// Définition des routes avec les fonctions de contrôleur correspondantes
routeUserApi.get("/user", getAllUsers);
routeUserApi.get("/user/:id", getOneUser);
routeUserApi.post("/user/inscription", postCreatedUsers);
routeUserApi.post("/user/connexion", postConnectedUsers);
routeUserApi.put("/user/:id", updateOneUser);
routeUserApi.delete("/user/:id", deleteOneUser);
