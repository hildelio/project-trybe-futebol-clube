import { IUser } from '../Interfaces/user/IUser';
import { IUserModel } from '../Interfaces/user';
import SequelizeUser from '../database/models/UserModel';

export default class LoginModel implements IUserModel {
  private model = SequelizeUser;

  async findOne(email: string):Promise<IUser | null> {
    const User = await this.model.findOne({ where: { email }, plain: true });
    return User || null;
  }
}
