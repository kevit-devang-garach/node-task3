import { Router } from 'express';
import StaffController from './staff.controller';
import { authenticateMiddleware } from '../../middleware/auth.middleware';

class Staff {
  path = '/staff';

  router = Router();

  staffController = new StaffController();

  constructor() {
    console.log('Staff Route Contructor');
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}/create`, authenticateMiddleware.authorize, this.staffController.signUpUser);
  }
}
export default Staff;
