import { Router } from 'express';
import StaffController from './staff.controller';
import { authenticateMiddleware } from '../../middleware/auth.middleware';
import { validateRequestMiddleware } from '../../middleware/error.middleware';
import { signInUserSchema, signUpUserSchema } from './staff.model';

class Staff {
  path = '/staff';

  router = Router();

  staffController = new StaffController();

  constructor() {
    console.log('Staff Route Contructor');
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}/create`, validateRequestMiddleware(signUpUserSchema),this.staffController.signUpUser);
    this.router.post(`${this.path}/signIn`, validateRequestMiddleware(signInUserSchema),this.staffController.signInUser);
  }
}
export default Staff;
