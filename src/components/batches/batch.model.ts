// import jwt from 'jsonwebtoken';
import { Document, Model, model, Schema } from 'mongoose';
import HttpException from '../../utils/error.utils';
import { BATCHES_ERROR_CODES } from './batch.error';

export const addBatchSchema = {
  year: {
    isLength: {
      options: { min: 4, max: 4 },
    },
  },
  totalStudents: {
    isNumber: true,
    errorMessage: 'Batch total Students is required in number',
  },
};

export interface BatchDocument extends Document {
  year: number;
  totalStudents: number;
  branches: [
    {
      branch: string;
      totalStudentsIntake: number;
    }
  ];
}

// ===================================
// Validate requests
// ===================================

export interface BatchDocument extends Document {
  name: string;
}

interface BatchModel extends Model<BatchDocument> {
  findByDepartment(name: string): any;
}

// ===================================
// Batches schema to store in database
// ===================================

const batchesSchema = new Schema(
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

batchesSchema.statics.findByDepartment = async function (name) {
  console.log('inside find by batch, name', name);
  const batch = await Batches.findOne({ name: name });
  console.log('valid batch', batch);
  if (!batch) {
    throw new HttpException(404, BATCHES_ERROR_CODES.BATCHES_NOT_FOUND, 'BATCHES_NOT_FOUND', null, {
      batch: name,
    });
  }

  return batch;
};

const Batches: BatchModel = model<BatchDocument, BatchModel>('batches', batchesSchema);
export default Batches;
