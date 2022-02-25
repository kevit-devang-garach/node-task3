import { Router } from 'express';
import AnalyticsController from './analytics.controller';
import { authenticateMiddleware } from '../../middleware/auth.middleware';
import { validateRequestMiddleware } from '../../middleware/error.middleware';


class AnalyticsRoute {
  path = '/analytics';

  router = Router();

  analyticsController = new AnalyticsController();

  constructor() {
    console.log('Analytics Route Contructor');
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      `${this.path}/list-of-batches`,
      authenticateMiddleware.authorize,
    //   validateRequestMiddleware(signUpUserSchema),
      this.analyticsController.listOfBatches
    );
    this.router.post(
      `${this.path}/absent-students`,
      authenticateMiddleware.authorize,
    //   validateRequestMiddleware(signUpUserSchema),
      this.analyticsController.findAbsentStudent
    );
    this.router.post(
      `${this.path}/below-75-attendance`,
      authenticateMiddleware.authorize,
    //   validateRequestMiddleware(signUpUserSchema),
      this.analyticsController.listOfABStudentBelow75Per
    );
    this.router.post(
      `${this.path}/vacant-seats`,
      authenticateMiddleware.authorize,
    //   validateRequestMiddleware(signUpUserSchema),
      this.analyticsController.vacantSeats
    );
  }
}
export default AnalyticsRoute;
