import { Router } from 'express';
import teamsRouter from './teamsRouter';
import handleError from '../middlewares/handleError';

const router = Router();

router.use('/teams', handleError, teamsRouter);

export default router;
