import { config as configDotenv } from "dotenv";
import { type NextFunction, type Response } from "express";
import { type IncomingHttpHeaders } from "http";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { type IgetUserAuthInfoRequest, type PayloadRequestUser } from "../types/types";
import { handleError } from "../utils/errors";

// Charger les variables d'environnement depuis un fichier .env
configDotenv({ path: "./src/config/.env" });

// Valider que `secretKey` est définie
const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
  throw new Error("SECRET_KEY n'est pas définie dans les variables d'environnement.");
}

// Fonction de génération de token
export const generateJwt = (user: PayloadRequestUser): string => {
  const payload: JwtPayload = {
    userId: user.userId,
    username: user.fullname,
    isAdmin: user.isAdmin
  };
  const options: SignOptions = {
    expiresIn: "1h"
  };
  const token: string = jwt.sign(payload, secretKey, options);
  return `Bearer ${token}`;
};

// Fonction de vérification du token avec gestion des erreurs
const verifyToken = (token: string | undefined): JwtPayload => {
  if (!token) {
    throw new Error("Token manquant");
  }

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    return decoded;
  } catch (error: unknown) {
    throw new Error("Token invalide");
  }
};

// Fonction pour obtenir le token des en-têtes
const getTokenFromHeaders = (headers: IncomingHttpHeaders): string | undefined => {
  const authorizationHeader = headers.authorization;
  if (!authorizationHeader) return undefined;

  const token = authorizationHeader.split(" ")[1];
  return token || undefined;
};

// Fonction pour authentifier les routes
export const authentification = (req: IgetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFromHeaders(req.headers);
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur lors de la récupération de l'utilisateur";
    return handleError(res, error, errorMessage);
  }
};
