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
    console.log('User Route Contructor');
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
  }
}
export default User;
