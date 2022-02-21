import { Router } from 'express';
import DepartmentController from './department.controller';

class DepartmentRoute {
  path = '/department';

  router = Router();

  departmentController = new DepartmentController();

  constructor() {
    console.log('Department Route Contructor');
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}`, this.departmentController.signUpUser);
  }
}
export default DepartmentRoute;
