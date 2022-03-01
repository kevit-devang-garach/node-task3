import mongoose from 'mongoose';
import HttpException from '../../utils/error.utils';
import Batches from '../batches/batch.model';
import { STUDENT_ERROR_CODES } from './student.error';
import Student, { StudentDocument } from './student.model';

export async function createNewStudent(studentObject: Pick<StudentDocument, "name" | "department" | "year" | "semester" | "admissionDate" | "mobile" | "address" | "UIDAI" | "isActive" >) {
  try {
    return await Student.create(studentObject);
  } catch (err) {
    throw new HttpException(
      500,
      STUDENT_ERROR_CODES.CREATE_STUDENT_UNHANDLED_IN_DB,
      'CREATE_STUDENT_UNHANDLED_IN_DB',
      err,
      null
    );
  }
}

export async function checkVacantSeats(department: string, year: number) {
  try {
    const batchObject = await Batches.aggregate([
      {
        $match: {
          year,
          branches: { $elemMatch: { department: new mongoose.Types.ObjectId(department), isActive: true } },
        },
      },
      {
        $project: {
          branches: {
            $filter: {
              input: '$branches',
              cond: {
                $eq: ['$$this.department', new mongoose.Types.ObjectId(department)],
              },
            },
          },
        },
      },
    ]);

    const totalActiveStudInDept = await Student.aggregate([
      {
        $match: { department: new mongoose.Types.ObjectId(department), year, isActive: true },
      },
      {
        $count: 'totalStudInDept',
      },
    ]);

    const batchBoolean =
      Object.keys(batchObject).length &&
      Object.keys(batchObject[0]).length &&
      Object.keys(batchObject[0].branches[0]).length;
      const studBoolean = Object.keys(totalActiveStudInDept).length && Object.keys(totalActiveStudInDept[0]).length;
      if (batchBoolean) {
        return (
          batchObject[0].branches[0].totalStudentsIntake >=
          (studBoolean ? (Object.keys(totalActiveStudInDept).length ? totalActiveStudInDept[0].totalStudInDept : 0) : 0)
        );
    }
    return false;
  } catch (err) {
    throw new HttpException(
      500,
      STUDENT_ERROR_CODES.CREATE_STUDENT_UNHANDLED_IN_DB,
      'CREATE_STUDENT_UNHANDLED_IN_DB',
      err,
      null
    );
  }
}
