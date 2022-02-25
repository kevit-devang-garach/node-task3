import { Response, Request, NextFunction} from 'express'
import HttpException from '../../utils/error.utils'
import { findBranchesOrdByTotalStudents, listOfAbsentStudents, listOfAbsentStudentsBelow75Percent, listVacantSeats } from './analytics.DAL';
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
    async findAbsentStudent(req: Request, res: Response, next: NextFunction){
        try{
            const {year, date,semester, department}= req.body;
            console.log(year, date, semester, department)
            if (req && req.user && (!req.user.isActive || !req.user.isAdmin)) {
                console.log('inside if');
                throw Error('USER IS NOT AUTHORIZED');
            }
            const result = await listOfAbsentStudents(year, date, semester, department)
            return res.status(200).send(result);
        }catch(err){
            console.log("error:",err);
            return next(err);
        }
        
    }

    async listOfABStudentBelow75Per(req: Request, res: Response, next: NextFunction){
        try{
            if (req && req.user && (!req.user.isActive || !req.user.isAdmin)) {
                console.log('inside if');
                throw Error('USER IS NOT AUTHORIZED');
            }
            const {year, semester, department} = req.body;
            const result = await listOfAbsentStudentsBelow75Percent(year, semester, department);
            return res.status(200).send(result);
        }catch(err){
            console.log("error:",err);
            return next(err);
        }
    }
    async vacantSeats(req: Request, res: Response, next: NextFunction){
        try{
            if (req && req.user && (!req.user.isActive || !req.user.isAdmin)) {
                console.log('inside if');
                throw Error('USER IS NOT AUTHORIZED');
            }
            const result = await listVacantSeats();
            return res.status(200).send(result);
        }
        catch(err) {
            console.log("error:",err);
            return next(err);
        }
    }
}

export default AnalyticsController;