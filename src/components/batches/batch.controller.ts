import { NextFunction, Request, Response } from "express";
import { createNewBatch } from "./batch.DAL";

class BatchController {
    async create(req: Request, res: Response, next: NextFunction){
        try{
            const { year, branch, department, totalStudentsIntake, startDate, isActive } = req.body;
        if (req && req.user && (!req.user.isActive || !req.user.isAdmin)) {
            throw Error('USER IS NOT AUTHORIZED');
        }
        const branches = {name: branch, department, totalStudentsIntake, startDate, isActive}
        const batchObject = { year, branches };
        const batch = await createNewBatch(batchObject);
        return res.status(201).send(batch);
        }
        catch(err){
            return next(err);
        }
    }
}
export default BatchController;