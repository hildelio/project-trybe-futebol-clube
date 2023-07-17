import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'joi';
import Joi = require('joi');
import { decodedToken } from '../utils/tokenJWT';

const tokenSchema = Joi.string().required().messages({
  'string.empty': 'Token not found',
  'any.required': 'Token not found',
});

export const hasToken = async (req: Request, res: Response, next: NextFunction):
Promise<Response | void> => {
  try {
    const { authorization } = req.headers;
    await tokenSchema.validateAsync(authorization);
    return next();
  } catch (error:unknown) {
    const validationError:ValidationError = error as ValidationError;
    const { message } = validationError.details[0];
    if (message.includes('not found')) {
      return res.status(401).json({ message });
    }
    return res.status(500).json({ message: 'internal server error' });
  }
};

export const tokenValidation = async (req: Request, res: Response, next: NextFunction):
Promise<Response | void> => {
  const { authorization } = req.headers;
  const [, token] = authorization?.split(' ') || [];
  try {
    decodedToken(token);
    return next();
  } catch (err:unknown) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
};

export const validateTokenRole = async (req: Request, res: Response): Promise<Response | void> => {
  const { authorization } = req.headers;
  const [, token] = authorization?.split(' ') || [];
  try {
    const user = decodedToken(token);
    return res.status(200).json({ role: user.role });
  } catch (err:unknown) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
};

export default {
  hasToken,
  tokenValidation,
};
