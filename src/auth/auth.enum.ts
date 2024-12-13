export enum TOKEN_TYPE {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}

export interface access_token_payload {
  sub: string;
}

export interface refresh_token_payload {
  sub: string;
}
