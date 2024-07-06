import { type Request, type Response } from "express";
import { generateJwt } from "../middlewares/jwt";
import { type IgetUserAuthInfoRequest, type PayloadRequestUser, type UserRequestBody } from "../types/types";
import { handleErrors } from "../utils/errors";
import {
  checkExistingUserByEmail,
  checkUserPassword,
  createUser,
  deleteUser,
  findUserByEmail,
  getAllUsersService,
  getUserById,
  updateUser,
  validateUserData,
  validateUserInput,
  validateUserPartialData
} from "../utils/users";

// Contrôleur pour la route GET /user
export const getAllUsers = async (req: IgetUserAuthInfoRequest, res: Response) => {
  try {
    const { isAdmin } = req?.user as PayloadRequestUser;
    if (!isAdmin) {
      return res.status(409).json({ message: "Vous n'êtes pas autorisé à effectuer cette action" });
    }

    const users = await getAllUsersService();
    return res.status(200).json(users);
  } catch (error: unknown) {
    return handleErrors(error, res, "Erreur lors de la récupération des utilisateurs");
  }
};

// Contrôleur pour la route GET /user/:id
export const getOneUser = async (req: IgetUserAuthInfoRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isAdmin, userId } = req?.user as PayloadRequestUser;
    if (isAdmin) {
      const user = await getUserById(id);
      return res.status(200).json(user);
    }

    const user = await getUserById(userId);
    return res.status(200).json(user);
  } catch (error: unknown) {
    return handleErrors(error, res, "Erreur lors de la récupération de l'utilisateur");
  }
};

// Contrôleur pour la route POST /user
export const postCreatedUsers = async (req: Request, res: Response) => {
  try {
    const { fullname, email, profession, city, contact, password } = req.body as UserRequestBody;
    await validateUserData({ fullname, email, profession, city, contact, password });
    await checkExistingUserByEmail(email);
    await createUser({ fullname, email, profession, city, contact, password });
    return res.status(201).json({ message: "L'utilisateur a été créé avec succès" });
  } catch (error: unknown) {
    return handleErrors(error, res, "Erreur lors de la création de l'utilisateur");
  }
};

// Contrôleur pour la route POST /user/connexion
export const postConnectedUsers = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as UserRequestBody;
    await validateUserInput({ email, password });
    const user = await findUserByEmail(email);
    if (!user || !(await checkUserPassword(password, user.password))) {
      throw new Error("L'email ou le mot de passe n'est pas correct");
    }

    const payload: PayloadRequestUser = { userId: user._id, fullname: user.fullname, isAdmin: user.isAdmin };
    const token = generateJwt(payload);
    // Création d'une copie de l'utilisateur sans le champ `password`
    const userWithoutPassword = { ...user.toObject(), password: null };
    return res
      .status(201)
      .json({ message: "L'utilisateur a été authentifié avec succès", token, user: userWithoutPassword });
  } catch (error: unknown) {
    return handleErrors(error, res, "Erreur lors de l'authentification de l'utilisateur");
  }
};

// Contrôleur pour la route PUT /user/:id
export const updateOneUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullname, profession, city, contact } = req.body as Partial<UserRequestBody>;
    await validateUserPartialData({ fullname, profession, city, contact });
    await getUserById(id);
    await updateUser(id, { fullname, profession, city, contact });
    return res.status(200).json({ message: "L'utilisateur a été modifié avec succès" });
  } catch (error: unknown) {
    return handleErrors(error, res, "Erreur lors de la mise à jour de l'utilisateur");
  }
};

// Contrôleur pour la route DELETE /user/:id
export const deleteOneUser = async (req: IgetUserAuthInfoRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req?.user?.isAdmin) {
      return res.status(409).json({ message: "Vous n'êtes pas autorisé à effectuer cette action" });
    }

    await getUserById(id);
    await deleteUser(id);
    return res.status(200).json({ message: `L'utilisateur avec cet id ${id} a été supprimé avec succès` });
  } catch (error: unknown) {
    return handleErrors(error, res, "Erreur lors de la suppression de l'utilisateur");
  }
};
