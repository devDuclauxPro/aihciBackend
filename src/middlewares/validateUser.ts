import { object, string, type Schema } from "yup";
import { type UserRequestBody } from "../types/types";

// Fonction pour créer des schémas de validation communs
const createCommonValidationSchema = () => ({
  fullname: string().required("Le nom complet est requis").min(2, "Le nom doit contenir au moins 2 caractères"),
  profession: string().required("La profession est requise"),
  city: string().required("La ville est requise"),
  contact: string().required("Le contact est requis").length(10, "Le contact doit contenir 10 caractères")
});

// Fonction pour créer des schémas de validation d'email et mot de passe
const createEmailPasswordValidationSchema = () => ({
  email: string().email("Email invalide").required("L'email est requis"),
  password: string()
    .required("Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
});

// Schéma de validation Yup pour l'utilisateur complet (email et mot de passe)
export const userEmailPasswordValidateSchema: Schema<Partial<UserRequestBody>> = object().shape({
  ...createEmailPasswordValidationSchema()
});

// Schéma de validation Yup pour l'utilisateur complet
export const userValidateSchema: Schema<UserRequestBody> = object().shape({
  ...createCommonValidationSchema(),
  ...createEmailPasswordValidationSchema()
});

// Schéma de validation Yup pour l'utilisateur partiel
export const userValidatePartialSchema: Schema<Partial<UserRequestBody>> = object().shape({
  ...createCommonValidationSchema()
});
