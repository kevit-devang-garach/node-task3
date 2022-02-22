import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Config from '../environments/index';
import { USER_ERROR_CODES } from '../components/users/user.error';
import User, { UserDocument } from '../components/users/user.model';
import HttpException from '../utils/error.utils';
// import { RequestCustom } from './middleware.interface';
const AUTH_ERROR_CODES = {
  HEADERS_NOT_SET_IN_REQUEST: 'Request not contain auth token',
};

class Authenticate {
  // async 
  authorize(req: Request, res: Response, next: NextFunction) {
    const newToken = JSON.stringify(req.header('authorization'));
        const token = JSON.parse(newToken).replace('Bearer ','');
        console.log("token",token)
        if (token) {
            User.findByToken(token).then((user:any) => {
                if (user) {
                    req.user = user.toJSON();
                    console.log("req..",req.user)
                    next();
                } else {
                    throw new HttpException(404, USER_ERROR_CODES.USER_NOT_FOUND, 'USER_NOT_FOUND', null,'');
                }
            });
        } else {
            throw new HttpException(
                400,
                AUTH_ERROR_CODES.HEADERS_NOT_SET_IN_REQUEST,
                'HEADERS_NOT_SET_IN_REQUEST',
                null,''
            );
        }
  // // console.log( typeof(req), typeof(res), typeof(next))
  // // console.log('auth middleware');
  // try{
  //     const newToken = JSON.stringify(req.header('authorization'));
  //     const token = JSON.parse(newToken).replace('Bearer ','');
  //     console.log("token authenticate",token);
  //     const decoded: any = jwt.verify(token, Config.JWT_AUTH);
  //     console.log("user decoded", decoded)
  //     const user = await User.findOne({ _id: decoded._id });
  //     console.log("user",user)
  //     if(!user){
  //         throw new Error()
  //     }
  //     req.token = token;
  //     req.user = user;
  //     // console.log(user);
  //     next();

  }
  // catch(e){
  //     res.status(401).send({ error : 'Please authenticate.'})
  // }
  // next()
  // }
}
// {
//     console.log("read",req.header('authorization'))
//     const token: string = JSON.stringify(req.header('authorization')).replace('Bearer ','');
//     console.log('token1', token, typeof token);
//     // const staff = new User();

//     // if (token) {
//       User.findByToken(token).then((user: UserDocument) => {
//         console.log("user under findByToken")
//         console.log("JSON",JSON.stringify(user))
//         // if (user) {
//         //   req.user = user;
//         //   next();
//         // } else {
//         //   throw new HttpException(404, USER_ERROR_CODES.USER_NOT_FOUND, 'USER_NOT_FOUND', null, '');
//         // }
//       });
//     // }
//     // else{
//     //   console.log("else part")
//     // }
//   }
// }


export const authenticateMiddleware = new Authenticate();
