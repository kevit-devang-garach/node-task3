import jwt from 'jsonwebtoken';
import { Document, Model, model, ObjectId, Schema } from 'mongoose';

export const attendance = {
    userId: {
        require: true,
        errorMessage: "member id required"
    },
    department: {
        require: true,
        errorMessage: "department id required"
    },
    year: {
         isLength: {min: 4, max: 4 },
         errorMessage: 'batch year is required'
    },
    semester: {
         isLength: {min: 1, max: 1 },
        errorMessage: 'student semester is required',
    },
    absentDate: {
        isDate: true,
        errorMessage: "absent date required"
    }
}

export interface AttendanceDocument extends Document {
    userId: ObjectId,
    department: ObjectId,
    absentDate: Date | number;
    reason: string;
    isStudent: boolean;
}
export interface AttendanceModel extends Model<AttendanceDocument>{

}
const attendanceSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required:true
        },
        department:{
            type: Schema.Types.ObjectId,
            required:true
        },
        absentDate: {
            type: Schema.Types.Date,
            required: true
        },
        reason: {
            type: Schema.Types.String,
            default: "LWR"
        },
        isStudent:{
            type: Schema.Types.Boolean,
            default: true
        }
    }
)

// ===================================
// Pre hook before saving it execute
// ===================================
attendanceSchema.pre('save', async function (next) {
    const student: any = this;
    console.log('attendance inside pre', student);
    
    next();
  });
  
  attendanceSchema.methods.toJSON = function(){
    const attendance = this;
    // console.log("student u",student);
    const attendanceObject = attendance.toObject();
    // console.log("attendanceObject",attendanceObject)
    // delete attendanceObject.password;
    // delete attendanceObject.avatar;
    // console.log("after update",attendanceObject)
    return attendanceObject;
}

const Attendance: AttendanceModel = model<AttendanceDocument, AttendanceModel>('attendance', attendanceSchema);
export default Attendance;