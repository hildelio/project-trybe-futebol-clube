import { Router } from 'express';
import MatchesController from '../controllers/MatchesController';

const matchesRouter = Router();

const matchesController = new MatchesController();

matchesRouter.get('/', (req, res, next) => matchesController.findAll(req, res, next));

export default matchesRouter;
