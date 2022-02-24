import { Response, Request, NextFunction} from 'express'
import HttpException from '../../utils/error.utils'
import { ANALYTICS_ERROR_CODES } from './analytics.error'

class AnalyticsController {
    async listOfBatches(req: Request, res: Response, next: NextFunction){
        try{
            // const { } = req.body;
            if (req && req.user && (!req.user.isActive || !req.user.isAdmin)) {
                console.log('inside if');
                throw Error('USER IS NOT AUTHORIZED');
            }
        }
        catch(err) {
            console.log("error:",err);
            return next(err);
        }
    } 
}

export default AnalyticsController;