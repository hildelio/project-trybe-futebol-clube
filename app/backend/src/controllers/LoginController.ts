import { NextFunction, Request, Response } from 'express';
import { responseWithToken } from '../utils/handleResponse';
import LoginService from '../services/LoginService';

export default class LoginController {
  private loginService: LoginService;
  constructor() {
    this.loginService = new LoginService();
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const response = await this.loginService.login(req.body);
      return responseWithToken(res, response);
    } catch (error) {
      next(error);
    }
  }
}
