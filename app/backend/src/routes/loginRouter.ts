import { Router } from 'express';
import loginValidation from '../middlewares/loginValidation';
import LoginController from '../controllers/LoginController';

const loginRouter = Router();

const loginController = new LoginController();

loginRouter.post('/', loginValidation, (req, res) => loginController.login(req, res));

export default loginRouter;
