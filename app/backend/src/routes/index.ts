import { Router } from 'express';
import teamsRouter from './teamsRouter';
import handleError from '../middlewares/handleError';
import loginRouter from './loginRouter';

const router = Router();

router.use('/teams', handleError, teamsRouter);
router.use('/login', loginRouter);

export default router;
