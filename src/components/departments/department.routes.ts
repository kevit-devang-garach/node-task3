import { Request, Response, Router } from 'express';
import { authenticateMiddleware } from '../../middleware/auth.middleware';
import { validateRequestMiddleware } from '../../middleware/error.middleware';
import DepartmentController from './department.controller';
import { addDepartmentSchema } from './department.model';
const xml = require('xml');

class DepartmentRoute {
  path = '/department';

  router = Router();

  departmentController = new DepartmentController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      authenticateMiddleware.authorize,
      validateRequestMiddleware(addDepartmentSchema),
      this.departmentController.create
    );
    this.router.post(`${this.path}/update`, authenticateMiddleware.authorize, this.departmentController.update);
    this.router.get(`${this.path}/soap`, (req: Request, res: Response) => {
      res.status(200).send(
        xml({
          restaurants: [
            {
              Buf_Type_Id: 1,
              Buf_Type_Name: 'Breakfast',
            },
            {
              Buf_Type_Id: 2,
              Buf_Type_Name: 'Lunch',
            },
            {
              Buf_Type_Id: 3,
              Buf_Type_Name: 'Dinner',
            },
          ],
        })
      );
    });
  }
}
export default DepartmentRoute;
