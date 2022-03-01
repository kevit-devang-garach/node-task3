import { Response, Request, NextFunction } from 'express';
import HttpException from '../../utils/error.utils';
import { createNewMember } from './user.DAL';
import { USER_ERROR_CODES } from './user.error';
import User from './user.model';

class UserController {
  async signUpUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, department, password, isActive, isAdmin } = req.body;
      if (req && req.user && (!req.user.isActive || !req.user.isAdmin)) {
        throw Error('USER IS NOT AUTHORIZED');
      }
      const userObject = { name, email, department, password, isActive, isAdmin };
      const user = await createNewMember(userObject);
      return res.status(201).send(user);
    } catch (err) {
      return next(err);
    }
  }

  async signInUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new HttpException(400, USER_ERROR_CODES.SIGN_IN_BAD_REQUEST, 'SIGN_IN_BAD_REQUEST', null, null);
      }
      const user = await User.findByCredentials(email, password);

      if (!user) {
        throw new HttpException(404, USER_ERROR_CODES.SIGN_IN_FAIL, 'SIGN_IN_FAIL', null, null);
      }
      const userToken = await user.getAuthToken();
      return res.status(200).send({ user, accessToken: userToken });
    } catch (err) {
      return next(err);
    }
  }
}
export default UserController;
