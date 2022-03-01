import { Response, Request, NextFunction } from 'express';
import { createNewDepartment, updateDepartment } from './department.DAL';
import Departments from './department.model';

class DepartmentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, startDate, batches, isActive } = req.body;
      if (req && req.user && (!req.user.isActive || !req.user.isAdmin)) {
        throw Error('USER IS NOT AUTHORIZED');
      }
      const departmentObject = { name, startDate, batches, isActive };
      const department = await createNewDepartment(departmentObject);
      return res.status(201).send(department);
    } catch (err) {
      return next(err);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {

    const updates: Array<string> = Object.keys(req.body);

    const allowedUpdates = ['batches', 'isActive', 'name'];

    const updateMatch = updates.every(updates => allowedUpdates.includes(updates));

    if (!updateMatch) {
      throw new Error('Some fields are not allowed to update');
    }
    try {
      if (req && req.user && (!req.user.isActive || !req.user.isAdmin)) {
        throw new Error('USER NOT AUTHORIZED');
      }
      const department = await Departments.findByDepartment(req.body.name);
      let flag: boolean = false;
      let result;
      for (let batchNo = 0; batchNo < department.batches.length; batchNo++) {
        if (department.batches[batchNo].year === (req && req.body && req.body.batches.year)) {
          result = updateDepartment(req.body);
          flag = true;
        }
      }

      if (!flag) {
        department.batches.push(req.body.batches);
        await department.save();
        return res.status(200).send({ batch: req.body, message: 'batch not found added successfully' });
      }
      return res.status(200).send({ batch: req.body, message: 'batch updated successfully' });
    } catch (err) {
      return next(err);
    }
  }
}
export default DepartmentController;
