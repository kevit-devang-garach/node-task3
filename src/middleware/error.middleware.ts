import { Response, Request, NextFunction } from 'express';

import { checkSchema, validationResult } from 'express-validator';
import HttpException from '../utils/error.utils';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  try {
    // set meta data
    let tranceMeta;
    if (err.meta) {
      tranceMeta = { ...err.meta, ...{ traceId: req.id } };
    } else {
      tranceMeta = { traceId: req.id };
    }

    // logging error login
    if (err && err.originalError) {
      req.log.error(`${err.originalError} >> ${err.message}`);
    } else if (err && err.errorCode) {
      req.log.trace(`${err.errorCode} >> ${err.message} >> ${JSON.stringify(tranceMeta, null, 2)}`);
    } else {
      req.log.error(err);
    }

    // returning response to endpoints
    if (err && err.statusCode) {
      res.status(err.statusCode).send({
        error: err.errorCode,
        message: err.message,
        meta: tranceMeta,
      });
    } else {
      res.status(500).send({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occured.',
      });
    }
  } catch (error) {
    next(error);
  }
};

export function validateRequestMiddleware(schema: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await checkSchema(schema).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(
        new HttpException(400, 'Middleware validation fail', 'MIDDLWARE_VALIDATION_ERROR', null, {
          ...errors,
        })
      );
    }
    next();
  };
}
