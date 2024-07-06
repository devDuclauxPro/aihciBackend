import { compare, genSalt, hash } from "bcryptjs";
import mongoose from "mongoose";
import {
  userEmailPasswordValidateSchema,
  userValidatePartialSchema,
  userValidateSchema
} from "../middlewares/validateUser";
import { userModel } from "../models/users.model";
import { type UserRequestBody } from "../types/types";

// Service pour obtenir tous les utilisateurs
export const getAllUsersService = async (): Promise<UserRequestBody[]> => {
  return userModel.find().sort({ createdAt: -1 });
};

// Service pour obtenir un utilisateur par ID
export const getUserById = async (id: string | mongoose.Types.ObjectId): Promise<UserRequestBody> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`L'utilisateur avec cet id ${id as string} n'existe pas`);
  }

  const user = await userModel.findById(id);

  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  return user;
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

// Fonction pour trouver un utilisateur par email
export const findUserByEmail = async (email: string) => {
  return userModel.findOne({ email });
};

// Fonction pour vérifier le mot de passe utilisateur
export const checkUserPassword = async (inputPassword: string, storedPassword: string) => {
  return compare(inputPassword, storedPassword);
};

// Service pour valider les données utilisateur
export const validateUserData = async (data: UserRequestBody) => {
  await userValidateSchema.validate(data, { abortEarly: false });
};

// Service pour valider partiellement les données utilisateur
export const validateUserPartialData = async (data: Partial<UserRequestBody>) => {
  await userValidatePartialSchema.validate(data, { abortEarly: false });
};

// Fonction pour valider les données utilisateur entrantes
export const validateUserInput = async (data: Partial<UserRequestBody>) => {
  await userEmailPasswordValidateSchema.validate(data, { abortEarly: false });
};
