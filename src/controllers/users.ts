import { type Request, type Response } from "express";
import { ValidationError } from "yup";
import { type UserRequestBody } from "../types/types";
import {
  checkExistingUserByEmail,
  checkUserExistsById,
  createUser,
  deleteUser,
  getAllUsersService,
  getOneUserService,
  handleError,
  updateUser,
  validateUserData,
  validateUserPartialData
} from "../utils/users";

// Contrôleur pour la route
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    return res.status(200).json(users);
  } catch (error) {
    return handleError(
      res,
      error,
      error instanceof Error ? error.message : "Erreur lors de la récupération des utilisateurs"
    );
  }
};

// Contrôleur pour la route
export const getOneUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getOneUserService(id);
    return res.status(200).json(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur lors de la récupération de l'utilisateur";
    return handleError(res, error, errorMessage);
  }
};

// Contrôleur pour la route POST /users
export const postUsers = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, UserRequestBody>,
  res: Response
) => {
  try {
    const { fullname, email, profession, city, contact, password } = req.body;

    // Valider les données de la requête
    await validateUserData({ fullname, email, profession, city, contact, password });

    // Vérifier si l'utilisateur existe déjà
    await checkExistingUserByEmail(email);

    // Créer un nouvel utilisateur
    await createUser({ fullname, email, profession, city, contact, password });

    // Retourner la réponse avec le statut 201 Created
    return res.status(201).json({ message: "L'utilisateur a été créé avec succès" });
  } catch (error) {
    if (error instanceof ValidationError) {
      // Si la validation échoue, retourner les erreurs de validation
      const validationErrors = error.inner.map((err) => ({
        path: err.path,
        message: err.message
      }));
      return res.status(400).json({ errors: validationErrors });
    } else if (error instanceof Error && error.message.includes("L'utilisateur avec cet email existe déjà")) {
      // Gestion d'erreurs spécifiques pour les utilisateurs existants
      return res.status(409).json({ error: error.message });
    }

    // Si une autre erreur survient, retourner une erreur serveur
    return handleError(res, error, "Erreur lors de la création de l'utilisateur");
  }
};

// Contrôleur pour la route PUT /users/:id
export const updateOneUser = async (
  req: Request<Record<string, string>, Record<string, unknown>, Partial<UserRequestBody>>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { fullname, profession, city, contact } = req.body;

    // Valider les données de la requête
    await validateUserPartialData({ fullname, profession, city, contact });

    // Vérifier si l'utilisateur existe
    await checkUserExistsById(id);

    // Mettre à jour l'utilisateur
    await updateUser(id, { fullname, profession, city, contact });

    // Retourner la réponse avec le statut 200 OK
    return res.status(200).json({ message: "L'utilisateur a été modifié avec succès" });
  } catch (error) {
    if (error instanceof ValidationError) {
      // Si la validation échoue, retourner les erreurs de validation
      const validationErrors = error.inner.map((err) => ({
        path: err.path,
        message: err.message
      }));
      return res.status(400).json({ errors: validationErrors });
    } else if (error instanceof Error && error.message.includes("n'existe pas")) {
      // Gestion d'erreurs spécifiques pour les utilisateurs inexistants
      return res.status(409).json({ error: error.message });
    }

    // Si une autre erreur survient, retourner une erreur serveur
    return handleError(res, error, "Erreur lors de la mise à jour de l'utilisateur");
  }
};

// Contrôleur pour la route DELETE /users/:id
export const deleteOneUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si l'utilisateur existe
    await checkUserExistsById(id);

    // Supprimer l'utilisateur
    await deleteUser(id);

    // Retourner la réponse avec le statut 200 OK
    return res.status(200).json({ message: `L'utilisateur avec cet id ${id} a été supprimé avec succès` });
  } catch (error) {
    if (error instanceof Error && error.message.includes("n'existe pas")) {
      // Gestion d'erreurs spécifiques pour les utilisateurs inexistants
      return res.status(409).json({ error: error.message });
    }

    // Si une autre erreur survient, retourner une erreur serveur
    return handleError(res, error, "Erreur lors de la suppression de l'utilisateur");
  }
};
