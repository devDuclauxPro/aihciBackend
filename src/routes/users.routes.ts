import express, { type Router } from "express";
import { deleteOneUser, getAllUsers, getOneUser, postUsers, updateOneUser } from "../controllers/users";

// Création du routeur Express
export const routeUserApi: Router = express.Router();

// Définition des routes avec les fonctions de contrôleur correspondantes
routeUserApi.get("/user", getAllUsers);
routeUserApi.get("/user/:id", getOneUser);
routeUserApi.delete("/user/:id", deleteOneUser);
routeUserApi.post("/user/inscription/:id", postUsers);
routeUserApi.put("/user/inscription/:id", updateOneUser);
