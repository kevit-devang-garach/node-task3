import HttpException from '../../utils/error.utils';
import { DEPARTMENT_ERROR_CODES } from './department.error';
import Departments from './department.model';

export async function createNewDepartment(departmentBody: any) {
  try {
    console.log('createNewDepartment');
    return await Departments.create(departmentBody);
  } catch (err) {
    console.log('error in catch new create dept');
    throw new HttpException(
      500,
      DEPARTMENT_ERROR_CODES.CREATE_DEPT_UNHANDLED_IN_DB,
      'CREATE_DEPT_UNHANDELED_IN_DB',
      err,
      null
    );
  }
}
export async function findDepartmentById(departmentId: any) {
  try {
    return await Departments.findById(departmentId).lean();
  } catch (err) {
    throw new HttpException(500, DEPARTMENT_ERROR_CODES.DEPARTMENT_NOT_FOUND, 'DEPARTMENT_NOT_FOUND', err, null);
  }
}

export async function updateDepartment(departmentBody: any) {
  console.log('inside update department dal', departmentBody);
  await Departments.findOneAndUpdate(
    {
      name: departmentBody.name,
      batches: { $elemMatch: { year: departmentBody.batches.year } },
    },
    { $set: { 'batches.$': departmentBody.batches } },
    { upsert: true, new: true }
  );
}
