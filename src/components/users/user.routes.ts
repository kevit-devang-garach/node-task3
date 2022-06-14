import { Router } from 'express';
import UserController from './user.controller';
import { authenticateMiddleware } from '../../middleware/auth.middleware';
import { validateRequestMiddleware } from '../../middleware/error.middleware';
import { signInUserSchema, signUpUserSchema } from './user.model';

class User {
  path = '/user';

  router = Router();

  userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      authenticateMiddleware.authorize,
      validateRequestMiddleware(signUpUserSchema),
      this.userController.signUpUser
    );
    this.router.post(
      `${this.path}/signIn`,
      validateRequestMiddleware(signInUserSchema),
      this.userController.signInUser
    );
    this.router.post(`${this.path}/message`, this.userController.sendMsg);
    this.router.post(`${this.path}/event`, this.userController.sendMsg2);
    this.router.post(`${this.path}/messages`, this.userController.getMsg);
  }
}
export default User;
