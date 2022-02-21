import { Response, Request, NextFunction } from 'express';
import HttpException from '../../utils/error.utils';
import { createNewDepartment } from './department.DAL';
import { DEPARTMENT_ERROR_CODES } from './department.error';
import Departments, { addDepartmentSchema } from './department.model';
class DepartmentController {
  async create(req: Request, res: Response, next: NextFunction) {
    console.log('keys:', Object.keys(req));
    console.log('department req', req);
    try {
      console.log(typeof req, typeof res, typeof next);
      const { name } = req.body;
      const departmentObject = { name } ;
      const department = await createNewDepartment(departmentObject)
      return res.status(200).json({ _id: department._id });
    } catch (err) {
      console.log('error: ', err);
    }
    return null;
  }
}
export default DepartmentController;
