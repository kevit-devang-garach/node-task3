import { Router } from 'express';
import StudentController from './student.controller';
import { authenticateMiddleware } from '../../middleware/auth.middleware';
import { validateRequestMiddleware } from '../../middleware/error.middleware';
import { addStudentSchema } from './student.model';

class Student {
  path = '/student';

  router = Router();

  studentController = new StudentController();

  constructor() {
    console.log('Student Route Contructor');
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      `${this.path}/add`,
      authenticateMiddleware.authorize,
      validateRequestMiddleware(addStudentSchema),
      this.studentController.add
    );
  }
}
export default Student;
