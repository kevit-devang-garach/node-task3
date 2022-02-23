import { Document } from 'mongoose';

export const addBatchSchema = {
  year: {
    isNumber: true,
    errorMessage: 'Batch year is required in number',
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
