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
    isLength: {
      options: { min: 2 },
    },
    errorMessage: 'Department name is required in request',
  },
};

export interface DepartmentDocument extends Document {
  name: string;
  startDate: Date;
  isActive: boolean;
  batches: [ {year: number, totalIntake: number}];
}

interface DepartmentModel extends Model<DepartmentDocument> {
  findByDepartment(name: string) : Promise<DepartmentDocument>;
}

// ===================================
// Departments schema to store in database
// ===================================

const departmentSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      unique: true,
      required: true,
    },
    startDate: {
      type: Schema.Types.Date,
      default: Date.now(),
    },
    batches: [
      {
        year: {
          type: Schema.Types.Number,
          required: true,
          unique: true,
        },
        totalIntake: {
          type: Schema.Types.Number,
          default: 0,
        },
      },
    ],
    isActive: {
      type: Schema.Types.Boolean,
      default: true,
    },
  },
  { versionKey: false, timestamps: true }
);

departmentSchema.statics.findByDepartment = async function (name) {
  const department = await Departments.findOne({ name: name });
  if (!department) {
    throw new HttpException(404, DEPARTMENT_ERROR_CODES.DEPARTMENT_NOT_FOUND, 'DEPARTMENT_NOT_FOUND', null, {
      department: name,
    });
  }

  return department;
};

const Departments: DepartmentModel = model<DepartmentDocument, DepartmentModel>('departments', departmentSchema);
export default Departments;
