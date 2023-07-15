import { IUser } from '../Interfaces/user/IUser';
import { IUserModel } from '../Interfaces/user';
import SequelizeUser from '../database/models/UserModel';

export default class LoginModel implements IUserModel {
  private model = SequelizeUser;

  async findOne(user:IUser):Promise<IUser | null> {
    const User = await this.model.findOne({ where: { email: user.email } });
    return User;
  }
}
