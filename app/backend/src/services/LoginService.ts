import { Response } from 'express';
import CustomError from '../utils/CustomError';
import httpStatus from '../utils/httpStatus';
import { IUser } from '../Interfaces/user/IUser';
import LoginModel from '../models/LoginModel';
import ServiceResponse from '../Interfaces/IServiceResponse';

export default class LoginService {
  private loginModel: LoginModel;
  constructor() {
    this.loginModel = new LoginModel();
  }

  public async login(user: IUser): Promise<ServiceResponse<IUser | null | Response>> {
    const response = await this.loginModel.findOne(user);

    if (!response) {
      throw new CustomError('User not founded', httpStatus.notFound);
    }
    if (user.password !== response.password) {
      throw new CustomError('Wrong username or password', httpStatus.unauthorized);
    }
    // implantar token e return ver se precisa de bycript
    return { type: httpStatus.ok, message: 'Success', data: { value: response } };
  }
}
