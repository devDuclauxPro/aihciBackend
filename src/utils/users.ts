import { genSalt, hash } from "bcryptjs";
import { type Response } from "express";
import mongoose from "mongoose";
import { userValidatePartialSchema, userValidateSchema } from "../middlewares/validate";
import { userModel } from "../models/users.model";
import { type UserRequestBody } from "../types/types";

// Gestionnaire d'erreurs centralisé
export const handleError = (res: Response, error: unknown, message = "Erreur serveur interne") => {
  if (error instanceof Error) {
    console.error(error);
    return res.status(500).json({ error: message });
  } else {
    console.error("Erreur inconnue", error);
    return res.status(500).json({ error: "Erreur inconnue" });
  }
};

// Service pour obtenir tous les utilisateurs
export const getAllUsersService = async (): Promise<UserRequestBody[]> => {
  try {
    return await userModel.find();
  } catch (error) {
    throw new Error("Erreur lors de la récupération des utilisateurs");
  }
};

// Service pour obtenir un utilisateur par ID
export const getOneUserService = async (id: string): Promise<UserRequestBody | undefined> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`L'utilisateur avec cet id ${id} n'existe pas`);
  }

  const user = await userModel.findById(id);
  if (!user) {
    throw new Error(`L'utilisateur avec cet id ${id} n'existe pas`);
  }

  return user;
};

// Service pour valider les données utilisateur
export const validateUserData = async (data: UserRequestBody) => {
  await userValidateSchema.validate(data, { abortEarly: false });
};

// Service pour valider les données utilisateur
export const validateUserPartialData = async (data: Partial<UserRequestBody>) => {
  await userValidatePartialSchema.validate(data, { abortEarly: false });
};

// Service pour vérifier si un utilisateur existe déjà par email
export const checkExistingUserByEmail = async (email: string) => {
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new Error("L'utilisateur avec cet email existe déjà");
  }
};

// Service pour hacher le mot de passe
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return hash(password, salt);
};

// Service pour vérifier si un utilisateur existe déjà par ID
export const checkUserExistsById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`L'utilisateur avec cet id ${id} n'existe pas`);
  }

  const user = await userModel.findById(id);
  if (!user) {
    throw new Error(`L'utilisateur avec cet id ${id} n'existe pas`);
  }

  return user;
};

// Service pour créer un nouvel utilisateur
export const createUser = async (userData: UserRequestBody) => {
  const { fullname, email, profession, city, contact, password } = userData;
  const hashedPassword = await hashPassword(password);
  await userModel.create({
    fullname,
    email,
    profession,
    city,
    contact,
    password: hashedPassword,
    isAdmin: email === process.env.EMAIL_ADMIN ? true : false
  });
};

// Service pour mettre à jour un utilisateur
export const updateUser = async (id: string, userData: Partial<UserRequestBody>) => {
  const { fullname, profession, city, contact } = userData;
  await userModel.findByIdAndUpdate(id, {
    fullname,
    profession,
    city,
    contact
  });
};

// Service pour supprimer un utilisateur
export const deleteUser = async (id: string) => {
  await userModel.findByIdAndDelete(id);
};
