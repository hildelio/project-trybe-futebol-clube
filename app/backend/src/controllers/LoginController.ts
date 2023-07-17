import { Request, Response } from 'express';
import { responseWithToken } from '../utils/handleResponse';
import LoginService from '../services/LoginService';

export default class LoginController {
  private loginService: LoginService;
  constructor() {
    this.loginService = new LoginService();
  }

  public async login(req: Request, res: Response): Promise<Response | void> {
    const response = await this.loginService.login(req.body);
    return responseWithToken(res, response);
  }
}
