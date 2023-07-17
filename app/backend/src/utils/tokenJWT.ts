import { Secret } from 'jsonwebtoken';
import jwt = require('jsonwebtoken');

const SECRET: Secret = process.env.JWT_SECRET || 'you-shall-not-pass';

type TokenPayload = {
  id: number;
};

export const tokenGenerator = (payload: TokenPayload): string =>
  jwt.sign(payload, SECRET);

export const decodedToken = (token: string): TokenPayload =>
  jwt.verify(token, SECRET) as TokenPayload;
