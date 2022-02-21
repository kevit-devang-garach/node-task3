import HttpException from '../../utils/error.utils';
import { USER_ERROR_CODES } from './staff.error';
import Staff from './staff.model';

export async function createNewMember(userBody: any) {
  try {
    return await Staff.create(userBody);
  } catch (err) {
    throw new HttpException(500, USER_ERROR_CODES.CREATE_USER_UNHANDLED_IN_DB, 'CREATE_USER_UNHANDELED_IN_DB', err, '');
  }
}
export async function findUserById(userId: any){
  try{
    return await Staff.findById(userId).lean()
  }
  catch(err){
    throw new HttpException(500, USER_ERROR_CODES.USER_NOT_FOUND,'USER_NOT_FOUND',err, '');
  }
}
