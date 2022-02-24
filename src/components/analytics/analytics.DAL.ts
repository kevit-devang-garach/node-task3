import HttpException from "../../utils/error.utils";
import Batches from "../batches/batch.model";

import { ANALYTICS_ERROR_CODES } from "./analytics.error";

export async function findBranchesOrdByTotalStudents(){
    try {
        return await Batches.aggregate([
            {
                $unwind:'$branches'
            },
            {
                $group:{
                    _id:'$year',
                    branches: {
                        $push: '$branches'
                        },
                    totalStudents: { $sum: '$branches.totalStudentsIntake'}
                }        
            },
            {
                $sort:{
                    totalStudents: -1
                }
            }
        ])
        
      } catch (err) {
        throw new HttpException(500, ANALYTICS_ERROR_CODES.AUTH_FAILED, 'AUTH_FAILED', err, null);
      }
}
