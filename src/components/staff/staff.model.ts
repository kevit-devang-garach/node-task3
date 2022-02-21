import jwt from 'jsonwebtoken';
import { Document, Model, model, Types, Schema, Query } from 'mongoose';

import { encap } from '../../services/helper';
import Config from '../../environments/index';
import HttpException from '../../utils/error.utils';
import { USER_ERROR_CODES } from './staff.error';

// import Member from './staff.interface';

// import HttpException from '../../utils/error.utils';

// const { Schema, model } = mongoose;
// ===================================
// Validate requests
// ===================================
interface Member extends Document  {
  name: string;
  department: string;
  email: string;
  password: string;
  findByToken: (token: string) => any;
}
export const signUpUserSchema = {
  name: {
    isString: true,
    isLength: {
      options: { min: 3 },
    },
    errorMessage: 'First name is required in request',
  },
  department: {
    isIn: ['EC', 'CE', 'MCA', 'admin'],
    isLength: {
      options: { min: 3 },
    },
    errorMessage: 'Department short name is required',
  },
  emailId: {
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
export interface UserDocument extends Member{
  joinDate: Date | number;
  isActive: boolean;
}
export interface UserModel extends Model<UserDocument>{
    findByToken(token:string): any
}

const staffSchema = new Schema<UserDocument, UserModel>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
    },
    department: {
      type: Schema.Types.String,
      // ref: 'deparments',
      required: true,
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
staffSchema.methods.getAuthToken = async function () {
  const  user = this;
  console.log('user auth', user);
  console.log('user id Hex String', user._id.toHexString());
  console.log('user id String', user._id.toString());
  const token = jwt.sign({ _id: user._id.toHexString() }, Config.JWT_PRIVATE_KEY, {
    expiresIn: '3d',
    algorithm: 'RS256',
  });
  console.log('token', token, typeof token);
  user.accessToken = token;
  await user.save();
  return token;
};

// ===================================
// find Staff member by token
// ===================================
staffSchema.statics.findByToken = function (token: string): Object {
  let decoded;
  try {
    decoded = jwt.verify(token, Config.JWT_PUBLIC_KEY);
    console.log('decoded after jwt verify', decoded);
  } catch (err: any) {
    console.log('err type', typeof err);
    let hasSessionExpired = false;
    if (err && err.message && err.message.includes('JWT Expired')) {
      hasSessionExpired = true;
    }
    if (hasSessionExpired)
      throw new HttpException(404, USER_ERROR_CODES.USER_SESSION_EXPIRED, 'USER_SESSION_EXPIRED', null, '');
    else throw new HttpException(404, USER_ERROR_CODES.AUTH_FAILED, 'AUTH_FAILED', null, '');
  }
  return this.findOne({
    _id: decoded,
    accessToken: token,
  });
};

// ===================================
// Pre hook before saving it execute
// ===================================
staffSchema.pre('save', async function (next) {
  const user: any = this;
  console.log('user inside pre', user);
  console.log('user inside pre save', user);
  if (user.isModified('password')) {
    console.log('user.password before hash', user.password);
    user.password = await encap.hash(user.password);
    console.log('after hash user.password', user.password);
  }
  next();
});

const Staff = model('staff', staffSchema);
export default Staff;
