import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'joi';
import * as Joi from 'joi';
import httpStatus from '../utils/httpStatus';

const createMatchSchema = Joi.object({
  homeTeamId: Joi.number().required().min(1).max(16),
  awayTeamId: Joi.number().required().min(1).max(16),
  // .not(Joi.ref('homeTeamId'))
  // .messages({
  //   'any.not': '422It is not possible to create a match with two equal teams',
  //   'number.base': '422It is not possible to create a match with two equal teams',
  // }),
}).messages({
  'any.required': '400All fields must be filled',
  'number.empty': '400All fields must be filled',
  'number.min': '404There is no team with such id!',
  'number.max': '404There is no team with such id!',
  'string.ref': '401Invalid email or password',
});
const createMatchValidation = async (req: Request, res: Response, next: NextFunction):
Promise<Response | void> => {
  try {
    const { homeTeamId, awayTeamId } = req.body;
    await createMatchSchema.validateAsync({ homeTeamId, awayTeamId });
    if (homeTeamId === awayTeamId) {
      return res.status(httpStatus.unprocessableEntity)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }
    return next();
  } catch (error: unknown) {
    const validationError: ValidationError = error as ValidationError;
    const { message } = validationError.details[0];
    const status = Number(message.slice(0, 3));
    const errorMessage = message.slice(3);
    res.status(status).json({ message: errorMessage });
  }
};

export default createMatchValidation;
