import { Router } from 'express';
import LoginController from '../controllers/LoginController';

const loginRouter = Router();

const loginController = new LoginController();

loginRouter.post('/login', (req, res, next) => loginController.login(req, res, next));

export default loginRouter;
