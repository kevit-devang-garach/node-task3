import { Document, Model, model, ObjectId, Schema } from 'mongoose';
import { encap } from '../../services/helper';

// ===================================
// Validate requests
// ===================================

export const addStudentSchema = {
  name: {
    isLength: {
      options: { min: 3 },
    },
    errorMessage: 'First name is member name is required',
  },
  // Getting error when is use isIn, even if field is present in postman with proper value
  department: {
    isString: true,
    errorMessage: 'student department id is required',
  },
  year: {
    isLength: { min: 4, max: 4 },
    errorMessage: 'batch year is required',
  },
  semester: {
    isLength: { min: 1, max: 1 },
    errorMessage: 'student semester is required',
  },
  mobile: {
    isLength: {
      options: { min: 10, max: 10 },
    },
    errorMessage: 'Please enter valid mobile number',
  },
  address: {
    isString: true,
    isLength: {
      options: { min: 3 },
    },
    errorMessage: 'student address is required, with proper address',
  },
  UIDAI: {
    isLength: {
      options: { min: 12, max: 12 },
    },
    errorMessage: 'Please enter valid aadhar card number',
  },
};

// ===================================
// Students schema to store in databreturn this.findOne({
// ===================================
export interface StudentDocument extends Document {
  name: string;
  department: ObjectId;
  year: number;
  semester: number;
  admissionDate: Date | number;
  mobile: number;
  address: string;
  UIDAI: number;
  isActive: boolean;
}
export interface StudentModel extends Model<StudentDocument> {
  findByCredentials(email: string): any;
  findByToken(token: string): any;
  toJSON(): any;
}

const studentSchema: Schema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'departments',
    },
    year: {
      type: Schema.Types.Number,
      required: true,
    },
    semester: {
      type: Schema.Types.Number,
      required: true,
    },
    admisssionDate: {
      type: Schema.Types.Date,
      default: Date.now(),
    },
    mobile: {
      type: Schema.Types.Number,
      required: true,
    },
    address: {
      type: Schema.Types.String,
      required: true,
    },
    UIDAI: {
      type: Schema.Types.String,
      unique: true,
      required: true,
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: true,
    },
  },
  { versionKey: false, timestamps: true }
);

// ===================================
// Pre hook before saving it execute
// ===================================
studentSchema.pre('save', async function (next) {
  const student: any = this;
  console.log('student inside pre', student);
  // console.log('student inside pre save', student);
  if (student.isModified('password')) {
    console.log('student.password before hash', student.password);
    student.password = await encap.hash(student.password);
    console.log('after hash student.password', student.password);
  }
  next();
});

studentSchema.methods.toJSON = function () {
  const student = this;
  // console.log("student u",student);
  const studentObject = student.toObject();
  // console.log("studentObject",studentObject)
  delete studentObject.password;
  delete studentObject.avatar;
  // console.log("after update",studentObject)
  return studentObject;
};

const Student: StudentModel = model<StudentDocument, StudentModel>('students', studentSchema);
export default Student;
