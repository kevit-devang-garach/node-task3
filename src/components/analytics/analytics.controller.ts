import { Response, Request, NextFunction} from 'express'
import HttpException from '../../utils/error.utils'
import { findBranchesOrdByTotalStudents } from './analytics.DAL';
import { ANALYTICS_ERROR_CODES } from './analytics.error'

class AnalyticsController {
    async listOfBatches(req: Request, res: Response, next: NextFunction){
        console.log("under listof batches under analytics controller")
        try{
            // const { } = req.body;
            if (req && req.user && (!req.user.isActive || !req.user.isAdmin)) {
                console.log('inside if');
                throw Error('USER IS NOT AUTHORIZED');
            }
            const result = await findBranchesOrdByTotalStudents();
            return res.status(200).send(result);
        }
        catch(err) {
            console.log("error:",err);
            return next(err);
        }
    } 
}

export default AnalyticsController;