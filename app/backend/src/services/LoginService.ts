import * as bcrypt from 'bcryptjs';
import { tokenGenerator } from '../utils/tokenJWT';
import httpStatus from '../utils/httpStatus';
import { IUser } from '../Interfaces/user/IUser';
import LoginModel from '../models/LoginModel';
import ServiceResponse from '../Interfaces/IServiceResponse';
import { ILoginUser } from '../Interfaces/user/ILoginUser';

export default class LoginService {
  private loginModel: LoginModel;
  constructor() {
    this.loginModel = new LoginModel();
  }

  public async login({ email, password }: ILoginUser):
  Promise<ServiceResponse<IUser | null>> {
    // verificar se posso melhorar esse código principalmente a const unauthorized, talvez com interface ou criando um arquivo de utils com todos os erros para chamar nas services.
    const unauthorized = {
      type: httpStatus.unauthorized,
      message: 'Invalid email or password',
      data: { value: null },
    };

    const response = await this.loginModel.findOne(email);
    if (!response) return unauthorized;

    const storedPassword = response.password;
    const passwordMatch = await bcrypt.compare(password, storedPassword);

    if (!passwordMatch) return unauthorized;

    const token = tokenGenerator({ id: response.id, role: response.role });
    return { type: httpStatus.ok, message: 'Success', data: { token } };
  }
}
