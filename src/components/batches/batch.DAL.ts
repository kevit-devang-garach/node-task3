import HttpException from "../../utils/error.utils";
import { BATCHES_ERROR_CODES } from "./batch.error";
import Batches from "./batch.model";
export async function createNewBatch(batchBody: any){
    try{
        console.log("createNewBatch")
        console.log("inside if condition")
        return await updateBranches(batchBody);     
    }catch(err){
        console.log("error in catch new create batch");
        throw new HttpException(
            500,
            BATCHES_ERROR_CODES.CREATE_BATCH_UNHANDLED_IN_DB,
            'CREATE_BATCH_UNHANDLED_IN_DB',
            err,
            null
          );
    }
}

export async function findBatchById(batchId: any) {
    try {
      return await Batches.findById(batchId).lean();
    } catch (err) {
      throw new HttpException(500, BATCHES_ERROR_CODES.BATCHES_NOT_FOUND, 'DEPARTMENT_NOT_FOUND', err, null);
    }
}

  export async function updateBranches(batchBody: any) {
    console.log('inside update department dal', batchBody);
    const found = await Batches.find({year: batchBody.year, branches: { $elemMatch: { name: batchBody.branches.name } }})
    console.log("found",found, found.length)
    if(!found.length){
        console.log("if")
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
        console.log("else")
        return await Batches.updateOne(
            {
                year: batchBody.year,
                branches: { $elemMatch: { name: batchBody.branches.name } },
              },
              { $set: { 'branches.$.totalStudentsIntake': batchBody.branches.totalStudentsIntake } },
              { upsert: true, new: true }
        ) 
    }
  }