export type User = {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string | undefined;
};

export type responseUser = {
  user: User;
};

export type PropsLogUser = {
  email: string;
  password: string;
};

export type PropsRegUser = {
  username: string;
  email: string;
  password: string;
};

export type PropsEditProfileUser = {
  token: string | null;
  username: string;
  email: string;
  password: string;
  image?: string | undefined;
};
