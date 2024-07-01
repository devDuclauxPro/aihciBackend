import { object, string, type Schema } from "yup";
import { type UserRequestBody } from "../types/types";

export const commonValidation = {
  fullname: string().required("Le nom complet est requis").min(2, "Le nom doit contenir au moins 2 caractères"),
  profession: string().required("La profession est requise"),
  city: string().required("La ville est requise"),
  contact: string()
    .required("Le contact est requis")
    .min(10, "Le contact doit contenir 10 caractères")
    .max(10, "Le contact doit contenir 10 caractères")
};

// Schéma de validation Yup pour l'utilisateur complet
export const userValidateSchema: Schema<UserRequestBody> = object().shape({
  ...commonValidation,
  email: string().email("Email invalide").required("L'email est requis"),
  password: string()
    .required("Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
});

// Schéma de validation Yup pour l'utilisateur partiel
export const userValidatePartialSchema: Schema<Partial<UserRequestBody>> = object().shape({
  ...commonValidation
});
