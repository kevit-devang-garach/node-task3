import { Document, Model, model, ObjectId, Schema } from 'mongoose';

export const addAttendanceSchema = {
  userId: {
    require: true,
    errorMessage: 'member id required',
  },
  department: {
    require: true,
    errorMessage: 'department id required',
  },
  year: {
    isLength: { min: 4, max: 4 },
    errorMessage: 'batch year is required',
  },
  semester: {
    isLength: { min: 1, max: 1 },
    errorMessage: 'student semester is required',
  },
  absentDate: {
    isDate: true,
    errorMessage: 'absent date required',
  }
};

export interface AttendanceDocument extends Document {
  userId: ObjectId;
  department: ObjectId;
  absentDate: Date | number;
  reason: string;
  isStudent: boolean;
  year: number;
  semester: number;
}
export interface AttendanceModel extends Model<AttendanceDocument> {}
const attendanceSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'students',
    required: true,
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'departments',
    required: true,
  },
  absentDate: {
    type: Schema.Types.Date,
    required: true,
  },
  reason: {
    type: Schema.Types.String,
    default: 'LWR',
  },
  isAbsent: {
    type: Schema.Types.Boolean,
    default: true,
  },
  isStudent: {
    type: Schema.Types.Boolean,
    default: true,
  },
},{ versionKey: false, timestamps: true });

// ===================================
// Pre hook before saving it execute
// ===================================
attendanceSchema.pre('save', async function (next) {
  const student = this;
  next();
});

attendanceSchema.methods.toJSON = function () {
  const attendance = this;
  const attendanceObject = attendance.toObject();
  return attendanceObject;
};

const Attendance: AttendanceModel = model<AttendanceDocument, AttendanceModel>('attendance', attendanceSchema);
export default Attendance;
