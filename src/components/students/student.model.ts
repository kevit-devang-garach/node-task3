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
  findByCredentials(email: string): Promise<StudentDocument>;
  findByToken(token: string): Promise<StudentDocument>;
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
  const student = this;
  if (student.isModified('password')) {
    student.password = await encap.hash(student.password);
  }
  next();
});

studentSchema.methods.toJSON = function () {
  const student = this;
  const studentObject = student.toObject();
  delete studentObject.password;
  delete studentObject.avatar;
  return studentObject;
};

const Student: StudentModel = model<StudentDocument, StudentModel>('students', studentSchema);
export default Student;
