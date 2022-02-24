import { Router } from 'express';
import AnalyticsController from './analytics.controller';
import { authenticateMiddleware } from '../../middleware/auth.middleware';
import { validateRequestMiddleware } from '../../middleware/error.middleware';


class Analytics {
  path = '/user';

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
  }
}
export default Analytics;
