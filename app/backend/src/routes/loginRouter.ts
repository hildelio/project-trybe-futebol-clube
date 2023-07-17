import { Router } from 'express';
import loginValidation from '../middlewares/loginValidation';
import LoginController from '../controllers/LoginController';
import { hasToken, validateTokenRole } from '../middlewares/tokenValidation';

const loginRouter = Router();

const loginController = new LoginController();

loginRouter.post('/', loginValidation, (req, res) => loginController.login(req, res));

loginRouter.get(
  '/role',
  hasToken,
  validateTokenRole,
);

export default loginRouter;
