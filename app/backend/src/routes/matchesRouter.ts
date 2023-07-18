import { Router } from 'express';
import MatchesController from '../controllers/MatchesController';
import { hasToken, tokenValidation } from '../middlewares/tokenValidation';

const matchesRouter = Router();

const matchesController = new MatchesController();

matchesRouter.get('/', (req, res, next) => matchesController.findAll(req, res, next));

matchesRouter.get(
  '/?inProgress=true',
  (req, res, next) => matchesController.findAll(req, res, next),
);

matchesRouter.patch(
  '/:id/finish',
  hasToken,
  tokenValidation,
  (req, res, next) => matchesController.finish(req, res, next),
);

matchesRouter.patch(
  '/:id',
  hasToken,
  tokenValidation,
  (req, res, next) => matchesController.updateScore(req, res, next),
);

export default matchesRouter;
