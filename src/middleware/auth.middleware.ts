import { NextFunction, Request, Response } from 'express';
import { USER_ERROR_CODES } from '../components/users/user.error';
import User from '../components/users/user.model';
import HttpException from '../utils/error.utils';

const AUTH_ERROR_CODES = {
  HEADERS_NOT_SET_IN_REQUEST: 'Request not contain auth token',
};

class Authenticate {
  authorize(req: Request, res: Response, next: NextFunction) {
    const token: string|undefined = req.header('authorization')?.replace('Bearer ', '')
    if (token) {
      User.findByToken(token).then((user: any) => {
        if (user) {
          req.user = user.toJSON();
          next();
        } else {
          throw new HttpException(404, USER_ERROR_CODES.USER_NOT_FOUND, 'USER_NOT_FOUND', null, '');
        }
      });
    } else {
      throw new HttpException(400, AUTH_ERROR_CODES.HEADERS_NOT_SET_IN_REQUEST, 'HEADERS_NOT_SET_IN_REQUEST', null, '');
    }

  }
}

export const authenticateMiddleware = new Authenticate();
