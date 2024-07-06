import { object, type Schema, string } from "yup";
import { type ArticleRequestBody } from "../types/types";

// Fonction pour créer des schémas de validation communs
const createCommunValidationSchema = () => ({
  title: string()
    .required("Le titre de l'article est requis")
    .min(2, "Le titre de l'article doit contenir au moins 2 caractères"),
  type: string().required("Le type de l'article est requie"),
  content: string().required("Le contenu de l'article est requis"),
  author: string().required("L'auteur de l'article est requis")
});

// Schéma de validation Yup pour l'article complet
export const articleValidateSchema: Schema<ArticleRequestBody> = object().shape({
  ...createCommunValidationSchema()
});
