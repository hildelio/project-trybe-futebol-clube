import { ILoginUser } from "../../Interfaces/user/ILoginUser";
import * as bcrypt from 'bcryptjs';

const adminLoginBCrypt: ILoginUser = {
  email: 'admin@admin.com',
  password: bcrypt.hashSync('secret_admin', 10),
}

const adminLogin: ILoginUser = {
  email: 'admin@admin.com',
  password: 'secret_admin',
}

const InvalidEmail: ILoginUser = {
  email: 'invalid.user@user.com',
  password: 'secret',
}

const invalidPassword: ILoginUser = {
  email: 'admin@admin.com',
  password: 'invalid',
}

export { 
  adminLoginBCrypt,
  adminLogin,
  InvalidEmail,
  invalidPassword,
}