export const STUDENT_ERROR_CODES = {
  // User Controller error codes
  BAD_REQUEST_GET_USERS: 'Imported parameter missing from request',
  SIGN_IN_BAD_REQUEST: 'Imported parameter missing in sign In request',
  SIGN_IN_FAIL: 'Provided cred are not correct',
  STUDENT_NOT_FOUND: 'Student not found for email id',
  INCORRECT_PASSWORD: 'Password incorrect',
  STUDENT_SESSION_EXPIRED: 'User login timeout',
  AUTH_FAILED: 'Auth failed',
  STUDENT_NOT_AUTHROIZED: 'User is not Authorized, please contact the admin',
  BAD_REQUEST_FOR_UPLOAD_PROFILE_PHOTO: 'Some imported parameter missing in upload request',
  UPLOAD_PROFILE_IMAGE_FAILED: 'Something went wrong while update profile picture',

  // User DAL error codes
  CREATE_STUDENT_UNHANDLED_IN_DB: 'Something went wrong while creating new student',
};
export default {
  STUDENT_ERROR_CODES,
};
