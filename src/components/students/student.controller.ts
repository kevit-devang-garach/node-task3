import mongoose from 'mongoose';
import { Response, Request, NextFunction } from 'express';
import { checkVacantSeats, createNewStudent } from './student.DAL';

class StudentController {
  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, department, year, semester, admissionDate, mobile, address, UIDAI, isActive } = req.body;
      if (req && req.user && !req.user.isActive) {
        throw Error('USER IS NOT AUTHORIZED');
      }
      const studentObject = { name, department, year, semester, admissionDate, mobile, address, UIDAI, isActive };
      if (!(await checkVacantSeats(studentObject.department, studentObject.year))) {
        return next('Housefull');
      }
      studentObject.department = new mongoose.Types.ObjectId(studentObject.department);
      const student = await createNewStudent(studentObject);
      return res.status(201).send(student);
    } catch (err) {
      return next(err);
    }
  }
}
export default StudentController;
