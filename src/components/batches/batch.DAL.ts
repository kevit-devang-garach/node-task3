import HttpException from "../../utils/error.utils";
import { BATCHES_ERROR_CODES } from "./batch.error";
import Batches, { BatchDocument } from "./batch.model";
export async function createNewBatch(batchBody: any){
    try{
        return await updateBranches(batchBody);     
    }catch(err){
        throw new HttpException(
            500,
            BATCHES_ERROR_CODES.CREATE_BATCH_UNHANDLED_IN_DB,
            'CREATE_BATCH_UNHANDLED_IN_DB',
            err,
            null
          );
    }
}

export async function findBatchById(batchId: Pick<BatchDocument, "_id">) {
    try {
      return await Batches.findById(batchId).lean();
    } catch (err) {
      throw new HttpException(500, BATCHES_ERROR_CODES.BATCHES_NOT_FOUND, 'DEPARTMENT_NOT_FOUND', err, null);
    }
}

  export async function updateBranches(batchBody: any) {
    const found = await Batches.find({year: batchBody.year, branches: { $elemMatch: { department: batchBody.branches.department } }}).lean()
    if(!found.length){
        return await Batches.updateOne({
            year: batchBody.year
        }, 
        {
            $push: { 'branches': batchBody.branches }
        },
        { 
            upsert: true
        })
    }
    else{
        return await Batches.updateOne(
            {
                year: batchBody.year,
                branches: { $elemMatch: { department: batchBody.branches.department } },
              },
              { $set: { 'branches.$.totalStudentsIntake': batchBody.branches.totalStudentsIntake } },
              { upsert: true, new: true }
        ).lean();
    }
  }