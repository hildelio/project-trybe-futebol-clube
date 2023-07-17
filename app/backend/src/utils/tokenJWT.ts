import { Secret } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';

const SECRET: Secret = process.env.JWT_SECRET || 'you-shall-not-pass';

type TokenPayload = {
  id: number;
  role: string;
};

export const tokenGenerator = (payload: TokenPayload): string =>
  jwt.sign(payload, SECRET);

export const decodedToken = (token: string): TokenPayload =>
  jwt.verify(token, SECRET) as TokenPayload;
