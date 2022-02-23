import { Response, Request, NextFunction } from 'express';
import { createNewDepartment, updateDepartment } from './department.DAL';
import Departments from './department.model';

class DepartmentController {
  async create(req: Request, res: Response, next: NextFunction) {
    console.log('keys:', Object.keys(req));
    console.log('department req', req.user);
    try {
      console.log(typeof req, typeof res, typeof next);
      const { name, startDate, batches, isActive } = req.body;
      if (req && req.user && (!req.user.isActive || !req.user.isAdmin)) {
        console.log('inside if');
        throw Error('USER IS NOT AUTHORIZED');
      }
      const departmentObject = { name, startDate, batches, isActive };
      console.log('departmentcontroller try');
      const department = await createNewDepartment(departmentObject);
      console.log('departmentcontroller after await create new department');
      return res.status(201).send(department);
    } catch (err) {
      console.log('error: ', err);
      return next(err);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {

    console.log('update req', req.body);

    const updates: Array<string> = Object.keys(req.body);

    const allowedUpdates = ['batches', 'isActive', 'name'];

    const updateMatch = updates.every(updates => allowedUpdates.includes(updates));

    console.log('updateMatch', updateMatch);
    if (!updateMatch) {
      throw new Error('Some fields are not allowed to update');
    }
    try {
      console.log('req...try');
      if (req && req.user && (!req.user.isActive || !req.user.isAdmin)) {
        console.log('inside if');
        throw new Error('USER NOT AUTHORIZED');
      }
      const department = await Departments.findByDepartment(req.body.name);
      // console.log('department before update', department);

      // 22 Feb 2022, leaving code changes here, still batches.year exist or not checking required
      let flag: boolean = false;
      let result;
      for (let batchNo = 0; batchNo < department.batches.length; batchNo++) {
        console.log('inside for loop');
        console.log('update type', typeof department.batches[batchNo]);
        console.log('update value', department.batches[batchNo]);
        console.log('checking year equality', department.batches[batchNo].year, req.body.batches.year);
        if (department.batches[batchNo].year === (req && req.body && req.body.batches.year)) {
          console.log('inside if block');
          console.log(
            'department.batches[batchNo].year',
            department.batches[batchNo].year,
            'req.body.year',
            req.body.batches.year
          );
          result = updateDepartment(req.body);
          flag = true;
          console.log('result', result, typeof result, 'flag', flag);
        }
      }

      console.log('outside foreach loop', flag);

      if (!flag) {
        department.batches.push(req.body.batches);
        await department.save();
        return res.status(200).send({ batch: req.body, message: 'batch not found added successfully' });
      }
      return res.status(200).send({ batch: req.body, message: 'batch updated successfully' });
    } catch (err) {
      console.log('error: ', err);
      return next(err);
    }
  }
}
export default DepartmentController;
