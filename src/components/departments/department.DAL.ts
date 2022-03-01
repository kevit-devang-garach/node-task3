import HttpException from '../../utils/error.utils';
import { DEPARTMENT_ERROR_CODES } from './department.error';
import Departments, { DepartmentDocument } from './department.model';

export async function createNewDepartment(departmentBody: Pick<DepartmentDocument, "name" | "startDate" | "batches" | "isActive">) {
  try {
    return await Departments.create(departmentBody);
  } catch (err) {
    throw new HttpException(
      500,
      DEPARTMENT_ERROR_CODES.CREATE_DEPT_UNHANDLED_IN_DB,
      'CREATE_DEPT_UNHANDELED_IN_DB',
      err,
      null
    );
  }
}
export async function findDepartmentById(departmentId: DepartmentDocument) {
  try {
    return await Departments.findById(departmentId).lean();
  } catch (err) {
    throw new HttpException(500, DEPARTMENT_ERROR_CODES.DEPARTMENT_NOT_FOUND, 'DEPARTMENT_NOT_FOUND', err, null);
  }
}

export async function updateDepartment(departmentBody: any) {
  await Departments.findOneAndUpdate(
    {
      name: departmentBody.name,
      batches: { $elemMatch: { year: departmentBody.batches.year } },
    },
    { $set: { 'batches.$': departmentBody.batches } },
    { upsert: true, new: true }
  ).lean();
}
