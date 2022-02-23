export const ATTENDANCE_ERROR_CODES = {
    // Attedance Controller error codes
    BAD_REQUEST_GET_ATTENDANCES: 'Imported parameter missing from request',
    SIGN_IN_BAD_REQUEST: 'Imported parameter missing in sign In request',
    SIGN_IN_FAIL: 'Provided cred are not correct',
    ATTENDANCE_NOT_FOUND: 'Attedance not found for email id',
    INCORRECT_PASSWORD: 'Password incorrect',
    ATTENDANCE_SESSION_EXPIRED: 'Attedance login timeout',
    AUTH_FAILED: 'Auth failed',
    ATTENDANCE_NOT_AUTHROIZED: 'Attedance is not Authorized, please contact the admin',
    BAD_REQUEST_FOR_UPLOAD_PROFILE_PHOTO: 'Some imported parameter missing in upload request',
    UPLOAD_PROFILE_IMAGE_FAILED: 'Something went wrong while update profile picture',
  
    // Attedance DAL error codes
    CREATE_ATTENDANCE_UNHANDLED_IN_DB: 'Something went wrong while adding attendace record',
  };
  export default {
    ATTENDANCE_ERROR_CODES,
  };
  