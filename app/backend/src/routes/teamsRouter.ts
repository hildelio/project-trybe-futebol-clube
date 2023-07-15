import { Router } from 'express';
import TeamsController from '../controllers/TeamsController';

const teamsRouter = Router();

const teamsController = new TeamsController();

teamsRouter.get('/', (req, res, next) => teamsController.findAll(req, res, next));

teamsRouter.get('/:id', (req, res, next) => teamsController.findById(req, res, next));

export default teamsRouter;
