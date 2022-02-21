import { Response, Request, NextFunction } from 'express';
import HttpException from '../../utils/error.utils';
import { createNewMember } from './staff.DAL';
import { USER_ERROR_CODES } from './staff.error';
import Staff, { signInUserSchema } from './staff.model';
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
      return res.status(201).json({ _id: user._id });
    } catch (err) {
      console.log('error: ', err);
    }
    return null;
  }

  async signInUser(req: Request,res: Response, next: NextFunction){
    console.log("Inside signInUser");
    try{
      console.log("under try block");
      const {email, password} = req.body;
      if(!email || !password){
        throw new HttpException(400, USER_ERROR_CODES.SIGN_IN_BAD_REQUEST, 'SIGN_IN_BAD_REQUEST', null, '');
      }
      const memberData = await Staff.findByCredentials(email, password);
      if(!memberData){
        throw new HttpException(404, USER_ERROR_CODES.SIGN_IN_FAIL, 'SIGN_IN_FAIL', null, '');
      }
      const userToken = await memberData.getAuthToken();
      return res.status(200).json({
        accessToken: userToken,
        userId: memberData._id,
        name: memberData.name,
        email: memberData.email
      })
    }
    catch(err){
      console.log("err",err)
      return next(err);
    }

  }
}
export default StaffController;
