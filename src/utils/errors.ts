import { type Response } from "express";
import { ValidationError } from "yup";

// Gestionnaire d'erreurs centralisé
export const handleError = (res: Response, error: unknown, message = "Erreur serveur interne") => {
  return res.status(500).json({ error: message });
};

// Fonction pour gérer les erreurs de validation
export const handleValidationErrors = (error: ValidationError, res: Response) => {
  const validationErrors = error.inner.map((err) => ({
    path: err.path,
    message: err.message
  }));
  return res.status(400).json({ errors: validationErrors });
};

// Fonction principale pour gérer les erreurs spécifiques
export const handleErrors = (error: unknown, res: Response, message: string) => {
  if (error instanceof ValidationError) {
    return handleValidationErrors(error, res);
  }

  if (error instanceof Error && error.message.includes("n'existe pas")) {
    return res.status(409).json({ error: error.message });
  }

  if (error instanceof Error && error.message.includes("L'utilisateur avec cet email existe déjà")) {
    return res.status(409).json({ error: error.message });
  }

  if (error instanceof Error) {
    return res.status(409).json({ error: error.message });
  }

  return handleError(res, error, message);
};
