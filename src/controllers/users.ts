import { type Request, type Response } from "express";
import { ValidationError } from "yup";
import { type UserRequestBody } from "../types/types";
import {
  checkExistingUserByEmail,
  checkUserExistsById,
  checkUserPassword,
  createUser,
  deleteUser,
  findUserByEmail,
  getAllUsersService,
  getOneUserService,
  handleError,
  handleValidationErrors,
  updateUser,
  validateUserData,
  validateUserInput,
  validateUserPartialData
} from "../utils/users";

// Contrôleur pour la route
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    return res.status(200).json(users);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur lors de la récupération de l'utilisateur";
    return handleError(res, error, errorMessage);
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
export const postCreatedUsers = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, UserRequestBody>,
  res: Response
) => {
  try {
    const { fullname, email, profession, city, contact, password } = req.body;
    await validateUserData({ fullname, email, profession, city, contact, password });
    await checkExistingUserByEmail(email);
    await createUser({ fullname, email, profession, city, contact, password });
    return res.status(201).json({ message: "L'utilisateur a été créé avec succès" });
  } catch (error) {
    if (error instanceof ValidationError) {
      return handleValidationErrors(error, res);
    } else if (error instanceof Error && error.message.includes("L'utilisateur avec cet email existe déjà")) {
      return res.status(409).json({ error: error.message });
    }

    return handleError(res, error, "Erreur lors de la création de l'utilisateur");
  }
};

// Contrôleur pour la route POST /users/connexion
export const postConnectedUsers = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, UserRequestBody>,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    await validateUserInput({ email, password });
    const user = await findUserByEmail(email);
    if (!user || !(await checkUserPassword(password, user.password))) {
      throw new Error("L'email ou le mot de passe n'est pas correct");
    }

    return res.status(201).json({ message: "L'utilisateur a été authentifié avec succès" });
  } catch (error) {
    if (error instanceof ValidationError) {
      return handleValidationErrors(error, res);
    } else if (error instanceof Error) {
      return res.status(409).json({ error: error.message });
    }

    return handleError(res, error, "Erreur lors de l'authentification de l'utilisateur");
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
    await validateUserPartialData({ fullname, profession, city, contact });
    await checkUserExistsById(id);
    await updateUser(id, { fullname, profession, city, contact });

    return res.status(200).json({ message: "L'utilisateur a été modifié avec succès" });
  } catch (error) {
    if (error instanceof ValidationError) {
      return handleValidationErrors(error, res);
    } else if (error instanceof Error && error.message.includes("n'existe pas")) {
      return res.status(409).json({ error: error.message });
    }

    return handleError(res, error, "Erreur lors de la mise à jour de l'utilisateur");
  }
};

// Contrôleur pour la route DELETE /users/:id
export const deleteOneUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await checkUserExistsById(id);
    await deleteUser(id);
    return res.status(200).json({ message: `L'utilisateur avec cet id ${id} a été supprimé avec succès` });
  } catch (error) {
    if (error instanceof Error && error.message.includes("n'existe pas")) {
      return res.status(409).json({ error: error.message });
    }

    return handleError(res, error, "Erreur lors de la suppression de l'utilisateur");
  }
};
