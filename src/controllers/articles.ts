import { type Request, type Response } from "express";
import { type ArticleRequestBody, type IgetUserAuthInfoRequest, type PayloadRequestUser } from "../types/types";
import {
  deleteArticle,
  getAllArticlesService,
  getArticleById,
  processArticleCreation,
  processArticleModify
} from "../utils/articles";
import { handleErrors } from "../utils/errors";

// Contrôleur pour la route GET /article
export const getAllArticles = async (req: Request, res: Response): Promise<Response> => {
  try {
    const articles = await getAllArticlesService();
    return res.status(200).json(articles);
  } catch (error: unknown) {
    return handleErrors(error, res, "Erreur lors de la récupération des articles");
  }
};

// Contrôleur pour la route GET /article/:id
export const getOneArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = await getArticleById(id);
    return res.status(200).json(article);
  } catch (error: unknown) {
    return handleErrors(error, res, "Erreur lors de la récupération d'un articles");
  }
};

// Contrôleur pour la route PUT /article/:id
export const putOneArticle = async (req: IgetUserAuthInfoRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { isAdmin, fullname } = req?.user as PayloadRequestUser;
    if (!isAdmin) {
      return res.status(409).json({ message: "Vous n'êtes pas autorisé à effectuer cette action" });
    }

    const articleData = req.body as ArticleRequestBody;
    await processArticleModify(id, articleData, fullname);
    return res.status(200).json({ message: "L'article a été modifié avec succès" });
  } catch (error: unknown) {
    return handleErrors(error, res, "Erreur lors de la modification de l'article");
  }
};

// Contrôleur pour la route POST /article/:id
export const postOneArticle = async (req: IgetUserAuthInfoRequest, res: Response): Promise<Response> => {
  try {
    const { isAdmin, fullname } = req?.user as PayloadRequestUser;
    const articleData = req.body as ArticleRequestBody;
    if (!isAdmin) {
      return res.status(409).json({ message: "Vous n'êtes pas autorisé à effectuer cette action" });
    }

    await processArticleCreation(articleData, fullname);
    return res.status(200).json({ message: "L'article a été créé avec succès" });
  } catch (error: unknown) {
    return handleErrors(error, res, "Erreur lors de la création de l'article");
  }
};

// Contrôleur pour la route DELETE /article/:id
export const deleteOneArticle = async (req: IgetUserAuthInfoRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req?.user as PayloadRequestUser;
    if (!isAdmin) {
      return res.status(409).json({ message: "Vous n'êtes pas autorisé à effectuer cette action" });
    }

    await deleteArticle(id);
    return res.status(200).json({ message: `L'utilisateur avec cet id ${id} a été supprimé avec succès` });
  } catch (error: unknown) {
    return handleErrors(error, res, "Erreur lors de la suppression de l'utilisateur");
  }
};
