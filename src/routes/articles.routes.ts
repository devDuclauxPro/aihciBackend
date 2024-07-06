import express, { type Router } from "express";
import {
  deleteOneArticle,
  getAllArticles,
  getOneArticle,
  postOneArticle,
  putOneArticle
} from "../controllers/articles";
import { authentification } from "../middlewares/jwt";

// Création du routeur Express
export const routeAricleApi: Router = express.Router();

// Définition des routes avec les fonctions de contrôleur correspondantes
routeAricleApi.get("/article", getAllArticles);
routeAricleApi.get("/article/:id", authentification, getOneArticle);
routeAricleApi.post("/article", authentification, postOneArticle);
routeAricleApi.put("/article/:id", authentification, putOneArticle);
routeAricleApi.delete("/article/:id", authentification, deleteOneArticle);
