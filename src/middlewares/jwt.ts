import { configDotenv } from "dotenv";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { type PayloadRequestUser } from "../types/types";

// Charger les variables d'environnement depuis un fichier .env
configDotenv({ path: "./src/config/.env" });

// Valider que `secretKey` est définie
const secretKey: string | undefined = process.env.SECRET_KEY;

if (!secretKey) {
  throw new Error("SECRET_KEY n'est pas défini dans les variables d'environnement.");
}

// Fonction de génération de token
export const generateJwt = (user: PayloadRequestUser): string => {
  const payload = {
    userId: user.userId,
    username: user.fullname,
    role: user.isAdmin
  };
  const options: SignOptions = {
    expiresIn: "1h"
  };
  const token: string = jwt.sign(payload, secretKey, options);
  return token;
};

// Fonction de vérification du token
export const verifyJwt = (token: string): string | JwtPayload | undefined => {
  try {
    const decoded: string | JwtPayload = jwt.verify(token, secretKey);
    return decoded;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Échec de la vérification JWT :", err.message);
    }

    return undefined;
  }
};
