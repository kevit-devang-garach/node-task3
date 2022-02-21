import { Response, Request, NextFunction } from 'express';

class DepartmentController {
  async signUpUser(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(typeof req, typeof res, typeof next);
      return res.status(200).json({ message: 'welcome' });
    } catch (err) {
      console.log('error: ', err);
    }
    return null;
  }
}
export default DepartmentController;
