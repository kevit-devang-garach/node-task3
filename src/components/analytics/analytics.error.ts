export const ANALYTICS_ERROR_CODES = {
    // User Controller error codes
    BAD_REQUEST_GET_USERS: 'Imported parameter missing from request',
    SIGN_IN_BAD_REQUEST: 'Imported parameter missing in sign In request',
    SIGN_IN_FAIL: 'Provided cred are not correct',
    USER_NOT_FOUND: 'User not found for email id',
    USER_SESSION_EXPIRED: 'User login timeout',
    AUTH_FAILED: 'Auth failed',
    USER_NOT_AUTHROIZED: 'User is not Authorized, please contact the admin',
  };
  export default {
    ANALYTICS_ERROR_CODES,
  };