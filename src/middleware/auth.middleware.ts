import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { USER_ERROR_CODES } from '../components/staff/staff.error';
import Staff from '../components/staff/staff.model';
import HttpException from '../utils/error.utils';

const AUTH_ERROR_CODS = {
  HEADER_NOT_SET_IN_REQUEST: 'Request not contain auth token',
};

class Authenticate {
  authorize(req: Request, res: Response, next: NextFunction) {
    const token = req.header('authorization');
    console.log('token', token);
    const staff = new Staff();

    if (token) {
      staff.findByToken(token).then((user: any) => {
        if (user) {
          // req.user = user;
          next();
        } else {
          throw new HttpException(404, USER_ERROR_CODES.USER_NOT_FOUND, 'USER_NOT_FOUND', null, '');
        }
      });
    }
  }
}
export const authenticateMiddleware = new Authenticate();
