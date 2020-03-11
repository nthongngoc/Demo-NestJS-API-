
export interface AccessToken {
  accessToken: string
}

export interface TokenPayload {
  _id: string;
}

export interface ReqUser {
  _id: string;
  email: string;
  role: string;
}