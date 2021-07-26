export type SignInInput = {
  email: string;
  password: string;
}

export type AuthData = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresInSeconds: number;
}