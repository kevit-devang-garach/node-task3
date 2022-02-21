import HttpException from '../../utils/error.utils';
import { DEPARTMENT_ERROR_CODES } from './department.error';
import Departments from './department.model';

export async function createNewDepartment(departmentBody: any) {
  try {
    return await Departments.create(departmentBody);
  } catch (err) {
    throw new HttpException(500, DEPARTMENT_ERROR_CODES.CREATE_USER_UNHANDLED_IN_DB, 'CREATE_USER_UNHANDELED_IN_DB', err, '');
  }
}
export async function findDepartmentById(departmentId: any){
  try{
    return await Departments.findById(departmentId).lean()
  }
  catch(err){
    throw new HttpException(500, DEPARTMENT_ERROR_CODES.DEPARTMENT_NOT_FOUND,'DEPARTMENT_NOT_FOUND',err, '');
  }
}
