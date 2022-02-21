import { Response, Request, NextFunction } from 'express';
import { createNewMember } from './staff.DAL';
class StaffController {
  async signUpUser(req: Request, res: Response, next: NextFunction) {
    console.log('keys:', Object.keys(req));
    console.log('signup req', req.body);
    try {
      // console.log(typeof req, typeof res, typeof next);
      const { name, email, department, password } = req.body;
      const userObject = { name, email, department, password };
      const user = await createNewMember(userObject);
      console.log('new member created', user);
      return res.status(200).json({ _id: user._id });
    } catch (err) {
      console.log('error: ', err);
    }
    return null;
  }
}
export default StaffController;
