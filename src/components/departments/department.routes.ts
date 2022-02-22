import { Router } from 'express';
import { authenticateMiddleware } from '../../middleware/auth.middleware';
import { validateRequestMiddleware } from '../../middleware/error.middleware';
import DepartmentController from './department.controller';
import { addDepartmentSchema } from './department.model';

class DepartmentRoute {
  path = '/department';

  router = Router();

  departmentController = new DepartmentController();

  constructor() {
    console.log('Department Route Contructor');
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}/create`, authenticateMiddleware.authorize, validateRequestMiddleware(addDepartmentSchema), this.departmentController.create);
    this.router.post(`${this.path}/update`, authenticateMiddleware.authorize, this.departmentController.update);
  }
}
export default DepartmentRoute;
