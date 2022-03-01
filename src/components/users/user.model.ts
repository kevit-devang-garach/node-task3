import jwt, { JwtPayload } from 'jsonwebtoken';
import { Document, Model, model, ObjectId, Schema } from 'mongoose';

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
  department: {
    isString: true,
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
  _id: ObjectId;
  name: string;
  email: string;
  department: string | ObjectId;
  password: string;
  joinDate: Date | number;
  isAdmin: boolean;
  isActive: boolean;
  getAuthToken(): string;
}
export interface UserModel extends Model<UserDocument> {
  findByCredentials(email: string, password: string): Promise<UserDocument>;
  findByToken(token: string): Promise<UserDocument>;
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
  const token = jwt.sign({ _id: user._id.toHexString() }, Config.JWT_AUTH, { expiresIn: '3d' });
  user.accessToken = token;
  return token;
};

// ===================================
// find User member by token
// ===================================
userSchema.statics.findByToken = async function (token) {
  let decoded: JwtPayload | string;
  try {
    decoded = jwt.verify(token, Config.JWT_AUTH);
  } catch (err: any) {
    let hasSessionExpired = false;
    if (err && err.message && err.message.includes('jwt expired')) {
      hasSessionExpired = true;
    }
    if (hasSessionExpired) {
      throw new HttpException(404, USER_ERROR_CODES.USER_SESSION_EXPIRED, 'USER_SESSION_EXPIRED', null, null);
    } else {
      throw new HttpException(404, USER_ERROR_CODES.AUTH_FAILED, 'AUTH_FAILED', null, null);
    }
  }
  return User.findOne({
    _id: Object.values(decoded)[0],
  });
};

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new HttpException(404, USER_ERROR_CODES.USER_NOT_FOUND, 'USER_NOT_FOUND', null, {
      email: email,
    });
  }
  if (user && !user.isActive) {
    throw new HttpException(404, USER_ERROR_CODES.USER_NOT_AUTHROIZED, 'USER_NOT_AUTHROIZED', null, null);
  }
  const res = await encap.verify(password, user.password);
  if (res === true) {
    return user;
  }
  throw new HttpException(404, USER_ERROR_CODES.INCORRECT_PASSWORD, 'INCORRECT_PASSWORD', null, null);
};

// ===================================
// Pre hook before saving it execute
// ===================================
userSchema.pre('save', async function (next) {
  const user: UserDocument = this;
  if (user.isModified('password')) {
    user.password = await encap.hash(user.password);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.avatar;
  return userObject;
};

const User: UserModel = model<UserDocument, UserModel>('users', userSchema);
export default User;
