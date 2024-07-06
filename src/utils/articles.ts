import mongoose from "mongoose";
import { articleValidateSchema } from "../middlewares/validateArticle";
import { articleModel } from "../models/article.model";
import { type ArticleRequestBody } from "../types/types";

// Service pour valider partiellement les données de l'article
const validateArticleData = async (data: ArticleRequestBody) => {
  await articleValidateSchema.validate(data, { abortEarly: false });
};

// Service pour obtenir tous les articles

export const getAllArticlesService = async () => {
  return articleModel.find().sort({ createdAt: -1 });
};

// Service pour créer un nouvel article
const createArticle = async (articleData: ArticleRequestBody) => {
  const { title, type, content, author } = articleData;
  await articleModel.create({ title, type, content, author });
};

// Service pour modifier un article
const putArticle = async (id: string, articleData: ArticleRequestBody) => {
  const { title, type, content, author } = articleData;
  await articleModel.findByIdAndUpdate(id, { title, type, content, author });
};

// Fonction pour obtenir un article par ID
export const getArticleById = async (id: string | mongoose.Types.ObjectId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`L'article avec cet id ${id as string} n'existe pas`);
  }

  const article = await articleModel.findById(id);

  if (!article) {
    throw new Error("Article introuvable");
  }

  return article;
};

// Fonction pour la creation d'un article
export const processArticleCreation = async (articleData: ArticleRequestBody, author: string) => {
  await validateArticleData({ ...articleData, author });
  await createArticle({ ...articleData, author });
};

// Fonction pour la modification d'un article
export const processArticleModify = async (id: string, articleData: ArticleRequestBody, author: string) => {
  await validateArticleData({ ...articleData, author });
  await putArticle(id, { ...articleData, author });
};

// Service pour supprimer un utilisateur
export const deleteArticle = async (id: string | mongoose.Types.ObjectId) => {
  await getArticleById(id);
  await articleModel.findByIdAndDelete(id);
};
