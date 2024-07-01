export type UserRequestBody = {
  fullname: string;
  email: string;
  profession: string;
  city: string;
  contact: string;
  password: string;
  isAdmin?: boolean;
};

export type ArticleRequestBody = {
  title: string;
  type: string;
  content: string;
};
