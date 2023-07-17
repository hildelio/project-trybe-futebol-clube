import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
}).messages({
  'any.required': '400All fields must be filled',
  'string.empty': '400All fields must be filled',
  'string.email': '401Invalid email or password',
  'string.min': '401Invalid email or password',
});
const loginValidation = async (req: Request, res: Response, next: NextFunction):
Promise<Response | void> => {
  try {
    await loginSchema.validateAsync(req.body);
    return next();
  } catch (error: unknown) {
    const validationError: ValidationError = error as ValidationError;
    const { message } = validationError.details[0];

    const status = Number(message.slice(0, 3));
    const errorMessage = message.slice(3);
    res.status(status).json({ message: errorMessage });
  }
};

export default loginValidation;
