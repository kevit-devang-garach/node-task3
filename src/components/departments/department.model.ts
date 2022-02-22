// import jwt from 'jsonwebtoken';
import { Document, Model, model, Schema } from 'mongoose';
import HttpException from '../../utils/error.utils';
import { DEPARTMENT_ERROR_CODES } from './department.error';
// ===================================
// Validate requests
// ===================================

export const addDepartmentSchema = {
    name: {
        isString: true,
        isLength:{
            options: {min:2}
        },
        errorMessage: 'Department name is required in request'
    }
}

export interface DepartmentDocument extends Document {
    name : string;
}

interface DepartmentModel extends Model<DepartmentDocument>{
    findByDepartment(name: string): any;
}

// ===================================
// Departments schema to store in database
// ===================================

const departmentSchema = new Schema({
    name:{
        type: Schema.Types.String,
        unique: true,
        required: true,
    },
    startDate: {
        type: Schema.Types.Date,
        default: Date.now()
    },
    batches:[
        {
            year: Schema.Types.Number,
            totalIntake: Schema.Types.Number
        }
    ],
    isActive: {
        type: Schema.Types.Boolean,
        default: true
    }
},{ versionKey: false, timestamps: true })


departmentSchema.statics.findByDepartment = async function (name) {
    console.log("inside find by department, name", name)
    const department = await this.findOne({ name: name });
    console.log("valid department",department)
    if (!department) {
        throw new HttpException(404, DEPARTMENT_ERROR_CODES.DEPARTMENT_NOT_FOUND, 'DEPARTMENT_NOT_FOUND', null, {
            department: name
        });
    }
    
    return department;
  };
// ===================================
// Pre hook before saving it execute
// ===================================
// departmentSchema.pre('save', async (next) => {
//     const user: any = this;
//     if(user.isModified('password')){
//         user.password = await encap.hash(user.password);
//     }
//     next();
// });

const Departments: DepartmentModel = model<DepartmentDocument, DepartmentModel>('departments', departmentSchema)
export default Departments;