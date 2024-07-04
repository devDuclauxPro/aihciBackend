import express, { type Router } from "express";
import {
  deleteOneUser,
  getAllUsers,
  getOneUser,
  postConnectedUsers,
  postCreatedUsers,
  updateOneUser
} from "../controllers/users";
import { authentification } from "../middlewares/jwt";

// Création du routeur Express
export const routeUserApi: Router = express.Router();

// Définition des routes avec les fonctions de contrôleur correspondantes
routeUserApi.get("/user", authentification, getAllUsers);
routeUserApi.get("/user/:id", authentification, getOneUser);
routeUserApi.post("/user/inscription", postCreatedUsers);
routeUserApi.post("/user/connexion", postConnectedUsers);
routeUserApi.put("/user/:id", authentification, updateOneUser);
routeUserApi.delete("/user/:id", authentification, deleteOneUser);
