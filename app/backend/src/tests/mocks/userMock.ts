import { IUser } from "../../Interfaces/user/IUser";
import * as bcrypt from 'bcryptjs';


const userMock: IUser = {
  id: 1,
  username: 'admin',
  role: 'admin',
  email: 'admin@admin.com',
  password: bcrypt.hashSync('secret_admin', 10),
}

export default userMock;