import { compare, genSalt, hash } from "bcryptjs";
import { type Response } from "express";
import mongoose from "mongoose";
import { type ValidationError } from "yup";
import {
  userEmailPasswordValidateSchema,
  userValidatePartialSchema,
  userValidateSchema
} from "../middlewares/validate";
import { userModel } from "../models/users.model";
import { type UserRequestBody } from "../types/types";

// Gestionnaire d'erreurs centralisé
export const handleError = (res: Response, error: unknown, message = "Erreur serveur interne") => {
  console.error(error instanceof Error ? error : "Erreur inconnue", error);
  return res.status(500).json({ error: message });
};

// Service pour obtenir tous les utilisateurs
export const getAllUsersService = async (): Promise<UserRequestBody[]> => {
  return userModel.find();
};

// Service pour obtenir un utilisateur par ID
export const getOneUserService = async (id: string): Promise<UserRequestBody> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`L'utilisateur avec cet id ${id} n'existe pas`);
  }

  const user = await userModel.findById(id);

  if (!user) {
    // return undefined; // Retourne undefined si aucun utilisateur n'est trouvé
    throw new Error(`L'utilisateur avec cet id ${id} n'existe pas`);
  }

  return user;
};

// Service pour valider les données utilisateur
export const validateUserData = async (data: UserRequestBody) => {
  await userValidateSchema.validate(data, { abortEarly: false });
};

// Service pour valider partiellement les données utilisateur
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

// Service pour hasher le mot de passe
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
    isAdmin: email === process.env.EMAIL_ADMIN
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

// Fonction pour valider les données utilisateur entrantes
export const validateUserInput = async (data: Partial<UserRequestBody>) => {
  await userEmailPasswordValidateSchema.validate(data, { abortEarly: false });
};

// Fonction pour trouver un utilisateur par email
export const findUserByEmail = async (email: string) => {
  return userModel.findOne({ email });
};

// Fonction pour vérifier le mot de passe utilisateur
export const checkUserPassword = async (inputPassword: string, storedPassword: string) => {
  return compare(inputPassword, storedPassword);
};

// Fonction pour gérer les erreurs de validation
export const handleValidationErrors = (error: ValidationError, res: Response) => {
  const validationErrors = error.inner.map((err) => ({
    path: err.path,
    message: err.message
  }));
  return res.status(400).json({ errors: validationErrors });
};
