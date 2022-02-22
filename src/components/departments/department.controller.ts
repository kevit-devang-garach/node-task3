import { Response, Request, NextFunction } from 'express';
import HttpException from '../../utils/error.utils';
import { createNewDepartment } from './department.DAL';
import { DEPARTMENT_ERROR_CODES } from './department.error';
import Departments, { addDepartmentSchema } from './department.model';
class DepartmentController {
  async create(req: Request, res: Response, next: NextFunction) {
    console.log('keys:', Object.keys(req));
    console.log('department req', req.user);
    try {
      console.log(typeof req, typeof res, typeof next);
      const { name, startDate, isActive } = req.body;
      if(req && req.user && (!req.user.isActive || !req.user.isAdmin)){
        console.log("inside if")
        throw Error("USER IS NOT AUTHORIZED")
      }
      const departmentObject = { name, startDate, isActive } ;
      console.log("departmentcontroller try");
      const department = await createNewDepartment(departmentObject)
      console.log("departmentcontroller after await create new department");
      return res.status(201).send(department);
    } catch (err) {
      console.log('error: ', err);
      return next(err);
    }
  }
}
export default DepartmentController;
