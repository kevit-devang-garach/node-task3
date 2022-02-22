import { Response, Request, NextFunction } from 'express';
import HttpException from '../../utils/error.utils';
import { createNewMember } from './user.DAL';
import { USER_ERROR_CODES } from './user.error';
import User, { signInUserSchema } from './user.model';
class UserController {
  async signUpUser(req: Request, res: Response, next: NextFunction) {
    // console.log('keys:', Object.keys(req));
    console.log('signup req', req.body);
    try {
      // console.log(typeof req, typeof res, typeof next);
      const { name, email, department, password, isActive, isAdmin } = req.body;
      if(req && req.user && (!req.user.isActive || !req.user.isAdmin)){
        console.log("inside if")
        throw Error("USER IS NOT AUTHORIZED")
      }
      const userObject = { name, email, department, password, isActive, isAdmin };
      const user = await createNewMember(userObject);
      console.log('new member created', user);
      return res.status(201).send(user);
    } catch (err) {
      console.log('error: ', err);
      return next(err);
    }
  }

  async signInUser(req: Request,res: Response, next: NextFunction){
    console.log("Inside signInUser");
    try{
      console.log("under try block");
      const {email, password} = req.body;
      if(!email || !password){
        throw new HttpException(400, USER_ERROR_CODES.SIGN_IN_BAD_REQUEST, 'SIGN_IN_BAD_REQUEST', null, '');
      }
      const user = await User.findByCredentials(email, password);
      console.log("user result",user)
      if(req && req.user && !req.user.isActive){
        console.log("inside if")
        throw Error("USER IS NOT AUTHORIZED")
      }
      if(!user){
        throw new HttpException(404, USER_ERROR_CODES.SIGN_IN_FAIL, 'SIGN_IN_FAIL', null, '');
      }
      const userToken = await user.getAuthToken();
      return res.status(200).send({user, accessToken: userToken})
    }
    catch(err){
      console.log("err",err)
      return next(err);
    }

  }
}
export default UserController;
