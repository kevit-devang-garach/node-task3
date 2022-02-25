import { NextFunction, Request, Response } from "express";
import { createNewBatch } from "./batch.DAL";

class BatchController {
    async create(req: Request, res: Response, next: NextFunction){
        console.log("inside batch controller, keys : ",Object.keys(req));
        console.log("batch req ", req.body)
        try{
            console.log("try");
            const { year, branch, department, totalStudentsIntake, startDate, isActive } = req.body;
        if (req && req.user && (!req.user.isActive || !req.user.isAdmin)) {
            console.log('inside if');
            throw Error('USER IS NOT AUTHORIZED');
        }
        const branches = {name: branch, department, totalStudentsIntake, startDate, isActive}
        const batchObject = { year, branches };
        console.log("batch obj:",batchObject)
        const batch = await createNewBatch(batchObject);
        console.log("batch obj saved")
        return res.status(201).send(batch);
        }
        catch(err){
            console.log("inside catch, error: ", err);
            return next(err);
        }
    }
}
export default BatchController;