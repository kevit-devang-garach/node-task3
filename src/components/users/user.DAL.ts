import HttpException from '../../utils/error.utils';
import { USER_ERROR_CODES } from './user.error';
import User from './user.model';

export async function createNewMember(userBody: any) {
  try {
    return await User.create(userBody);
  } catch (err) {
    throw new HttpException(500, USER_ERROR_CODES.CREATE_USER_UNHANDLED_IN_DB, 'CREATE_USER_UNHANDELED_IN_DB', err, '');
  }
}
export async function findUserById(userId: any){
  try{
    return await User.findById(userId).lean()
  }
  catch(err){
    throw new HttpException(500, USER_ERROR_CODES.USER_NOT_FOUND,'USER_NOT_FOUND',err, '');
  }
}
