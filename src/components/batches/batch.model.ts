// import jwt from 'jsonwebtoken';
import { Document, Model, model, ObjectId, Schema } from 'mongoose';
// import HttpException from '../../utils/error.utils';
// import { BATCHES_ERROR_CODES } from './batch.error';

export const addBatchSchema = {
  year: {
    isLength: {
      options: { min: 4, max: 4 },
    },
    errorMessage: "batch year is required"
  },
  branch: {
    isLength: {
      options: {min:2}
    },
    errorMessage: "department is required"
  }
};

export interface BatchDocument extends Document {
  year: number;
  totalStudents: number;
  branches: [
    {
      name: string;
      totalStudentsIntake: number;
    }
  ];
}

// ===================================
// Validate requests
// ===================================

export interface BatchDocument extends Document {
  year: number;
  _id: ObjectId;
}

interface BatchModel extends Model<BatchDocument> {
  findByYear(year: number): Promise<BatchDocument>;
  findByFields(year: number, branch: string): Promise<BatchDocument>;
}

// ===================================
// Batches schema to store in database
// ===================================
const branchArr = new Schema(
  {
    name: {
      type: Schema.Types.String,
      unique: true,
      required:true
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'departments',
      required: true,
      unique: true
    },
    totalStudentsIntake: {
      type: Schema.Types.Number,
      default: 0,
    },  
    startDate: {
      type: Schema.Types.Date,
      default: Date.now()
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: true,
    },
  }, {versionKey: false, timestamps: true}
)
const batchesSchema = new Schema(
  {
    year: {
      type: Schema.Types.Number,
      unique: true,
      required: true,
    },
    branches: [branchArr],
  },
  { versionKey: false }
);

batchesSchema.statics.findByYear = async function (year) {
  const batch = await Batches.findOne({ year: year });
  return batch;
};

batchesSchema.statics.findByFields = async function (year) {
  const batch = await Batches.findOne({ year: year });
  return batch;
};

const Batches: BatchModel = model<BatchDocument, BatchModel>('batches', batchesSchema);
export default Batches;
