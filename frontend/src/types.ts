export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

