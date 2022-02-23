import jwt from 'jsonwebtoken';
import { Document, Model, model, Schema } from 'mongoose';

import { encap } from '../../services/helper';
import Config from '../../environments/index';
import HttpException from '../../utils/error.utils';
import { USER_ERROR_CODES } from './user.error';

// ===================================
// Validate requests
// ===================================

export const signUpUserSchema = {
  name: {
    isLength: {
      options: { min: 3 },
    },
    errorMessage: 'First name is member name is required',
  },
  // Getting error when is use isIn, even if field is present in postman with proper value
  department: {
    isString: true,
    // isIn : ['staff','admin','MCA'],
    errorMessage: 'Department short name is required',
  },
  email: {
    isEmail: true,
    errorMessage: 'Please enter valid email',
  },
  password: {
    isStrongPassword: true,
    isLength: {
      options: {
        min: 8,
      },
    },
    errorMessage: 'Please enter strong passord',
  },
};

export const signInUserSchema = {
  email: {
    isEmail: true,
    errorMessage: 'Enter valid email Id',
  },
  password: {
    isString: true,
    errorMessage: 'Enter valid password',
  },
};

// ===================================
// Staff schema to store in databreturn this.findOne({
// ===================================
export interface UserDocument extends Document {
  name: string;
  department: string;
  email: string;
  password: string;
  joinDate: Date | number;
  isAdmin: boolean;
  isActive: boolean;
}
export interface UserModel extends Model<UserDocument> {
  findByCredentials(email: string, password: string): any;
  findByToken(token: string): any;
  toJSON(): any;
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      unique: true,
      required: true,
    },
    department: {
      enum: ['CE', 'admin', 'MCA'],
      type: Schema.Types.String,
      // ref: 'departments',
      default: 'MCA',
      
    },
    isAdmin: {
      type: Schema.Types.Boolean,
      default: false,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    joinDate: {
      type: Schema.Types.Date,
      default: Date.now(),
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: true,
    },
  },
  { versionKey: false, timestamps: true }
);

// ===================================
// General auth token method
// ===================================
userSchema.methods.getAuthToken = async function () {
  const user = this;
  console.log('user auth', user);
  console.log('user id Hex String', user._id.toHexString());
  console.log('user id String', user._id.toString());
  const token = jwt.sign({ _id: user._id.toHexString() }, Config.JWT_AUTH, {
    expiresIn: '3d',
  });
  console.log('token', token, typeof token);
  user.accessToken = token;
  // await user.save();
  return token;
};

// ===================================
// find User member by token
// ===================================
userSchema.statics.findByToken = async function (token) {
  let decoded: any;
  try {
    decoded = jwt.verify(token, Config.JWT_AUTH);
  } catch (err: any) {
    let hasSessionExpired = false;
    if (err && err.message && err.message.includes('jwt expired')) {
      hasSessionExpired = true;
    }
    if (hasSessionExpired) {
      throw new HttpException(404, USER_ERROR_CODES.USER_SESSION_EXPIRED, 'USER_SESSION_EXPIRED', null, '');
    } else {
      throw new HttpException(404, USER_ERROR_CODES.AUTH_FAILED, 'AUTH_FAILED', null, '');
    }
  }
  return this.findOne({
    _id: decoded._id,
  });
};

userSchema.statics.findByCredentials = async function (email, password) {
  console.log('inside find by credentials, email , password', email, password);
  const user = await User.findOne({ email: email });
  console.log('valid user', user);
  if (!user) {
    throw new HttpException(404, USER_ERROR_CODES.USER_NOT_FOUND, 'USER_NOT_FOUND', null, {
      email: email,
    });
  }
  if (user && !user.isActive) {
    console.log('inside if');
    throw new HttpException(404, USER_ERROR_CODES.USER_NOT_AUTHROIZED, 'USER_NOT_AUTHROIZED', null, null);
  }
  const res = await encap.verify(password, user.password);
  console.log('verify result', res);
  if (res === true) {
    return user;
  }
  throw new HttpException(404, USER_ERROR_CODES.INCORRECT_PASSWORD, 'INCORRECT_PASSWORD', null, null);
};
// userSchema.static('findByToken', function(token: string): any {
//   let decoded;
//   try {
//     decoded = jwt.verify(token, Config.JWT_PUBLIC_KEY);
//     console.log('decoded after jwt verify', decoded);
//   } catch (err: any) {
//     console.log('err type', typeof err);
//     let hasSessionExpired = false;
//     if (err && err.message && err.message.includes('JWT Expired')) {
//       hasSessionExpired = true;
//     }
//     if (hasSessionExpired)
//       throw new HttpException(404, USER_ERROR_CODES.USER_SESSION_EXPIRED, 'USER_SESSION_EXPIRED', null, '');
//     else throw new HttpException(404, USER_ERROR_CODES.AUTH_FAILED, 'AUTH_FAILED', null, '');
//   }
//   return this.findOne({
//     _id: decoded,
//     accessToken: token,
//   });
// });

// ===================================
// Pre hook before saving it execute
// ===================================
userSchema.pre('save', async function (next) {
  const user: any = this;
  console.log('user inside pre', user);
  // console.log('user inside pre save', user);
  if (user.isModified('password')) {
    console.log('user.password before hash', user.password);
    user.password = await encap.hash(user.password);
    console.log('after hash user.password', user.password);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const user = this;
  // console.log("user u",user);
  const userObject = user.toObject();
  // console.log("userObject",userObject)
  delete userObject.password;
  delete userObject.avatar;
  // console.log("after update",userObject)
  return userObject;
};

const User: UserModel = model<UserDocument, UserModel>('users', userSchema);
export default User;
