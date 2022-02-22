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
      const { name, startDate, batches, isActive } = req.body;
      if(req && req.user && (!req.user.isActive || !req.user.isAdmin)){
        console.log("inside if")
        throw Error("USER IS NOT AUTHORIZED")
      }
      const departmentObject = { name, startDate, batches, isActive } ;
      console.log("departmentcontroller try");
      const department = await createNewDepartment(departmentObject)
      console.log("departmentcontroller after await create new department");
      return res.status(201).send(department);
    } catch (err) {
      console.log('error: ', err);
      return next(err);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    console.log("update req", req.body);
    const updates = Object.keys(req.body);
    const allowedUpdates = ["batches","isActive","name"];
    const updateMatch = updates.every((updates) => allowedUpdates.includes(updates))
    console.log("updateMatch",updateMatch)
    if(!updateMatch){
       throw new Error("Some fields are not allowed to update");
    }
    try{
      console.log("req...try")
      if(req && req.user && (!req.user.isActive || !req.user.isAdmin)){
        console.log("inside if")
        throw new Error("USER NOT AUTHORIZED");
      }
      let department = await Departments.findByDepartment(req.body.name)
      console.log("department before update", department);

      // 22 Feb 2022, leavnig code changes here, still batches.year exist or not checking required
      updates.forEach((update) => {
        if(update !== 'batches'){
          department[update] = req.body[update]
        }
        else{
          department[update].push(req.body[update])
        }
      });
      console.log("department updated",department);
      await department.save();
      return res.status(200).send(department);
    }
    catch(err){
      console.log('error: ', err);
      return next(err);
    }
  }
}
export default DepartmentController;
