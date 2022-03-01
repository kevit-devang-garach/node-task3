import mongoose from 'mongoose';
import HttpException from '../../utils/error.utils';
import Attendance from '../attendance/attendance.model';
import Batches from '../batches/batch.model';
import { ANALYTICS_ERROR_CODES } from './analytics.error';

export async function findBranchesOrdByTotalStudents() {
  try {
    return await Batches.aggregate([
      {
        $unwind: '$branches',
      },
      {
        $group: {
          _id: '$year',
          branches: {
            $push: '$branches',
          },
          totalStudents: { $sum: '$branches.totalStudentsIntake' },
        },
      },
      {
        $sort: {
          totalStudents: -1,
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id',
          branches: 1,
          totalStudents: 1,
        },
      },
    ]);
  } catch (err) {
    throw new HttpException(500, ANALYTICS_ERROR_CODES.AUTH_FAILED, 'AUTH_FAILED', err, null);
  }
}

export async function listOfAbsentStudents(year: number, absentdate: string, semester: number, department: string) {
  try {
    return await Attendance.aggregate([
      {
        $match: {
          absentDate: new Date(absentdate),
        },
      },
      {
        $lookup: {
          from: 'students',
          localField: 'userId',
          foreignField: '_id',
          as: 'studentDetails',
        },
      },
      {
        $unwind: '$studentDetails',
      },
      {
        $match: {
          'studentDetails.year': year,
          'studentDetails.semester': semester,
          'studentDetails.department': new mongoose.Types.ObjectId(department),
        },
      },
      {
        $project: {
          name: '$studentDetails.name',
          _id: 0,
        },
      },
    ]);
  } catch (err) {
    throw new HttpException(500, ANALYTICS_ERROR_CODES.AUTH_FAILED, 'AUTH_FAILED', err, null);
  }
}

export async function listOfAbsentStudentsBelow75Percent(year: number, semester: number, department: string) {
  try {
    return await Attendance.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: 'userId',
          foreignField: '_id',
          as: 'studentDetails',
        },
      },
      {
        $unwind: '$studentDetails',
      },
      {
        $match: {
          $or: [
            {
              $and: [{ 'studentDetails.year': year }, { 'studentDetails.semester': semester }],
            },
            {
              'studentDetails.department': new mongoose.Types.ObjectId(department),
            },
          ],
        },
      },
      {
        $group: {
          _id: ['$studentDetails._id', '$studentDetails.name'],
          absentDays: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: '$_id',
          name: 1,
          absentDays: 1,
          absentPercentage: {
            $multiply: [{ $divide: [100, 140] }, '$absentDays'],
          },
        },
      },
      {
        $match: {
          absentPercentage: { $gt: 75 },
        },
      },
    ]);
  } catch (err) {
    throw new HttpException(500, ANALYTICS_ERROR_CODES.AUTH_FAILED, 'AUTH_FAILED', err, null);
  }
}

export async function listVacantSeats() {
  try {
    return await Batches.aggregate([
      {
        $unwind: '$branches',
      },
      {
        $group: {
          _id: '$year',
          branches: {
            $push: '$branches',
          },
          totalStudentsIntake: { $sum: '$branches.totalStudentsIntake' },
        },
      },
      {
        $sort: {
          totalStudentsIntake: -1,
        },
      },
      {
        $lookup: {
          from: 'students',
          pipeline: [
            {
              $group: {
                _id: '$year',
                totalStudents: { $sum: 1 },
              },
            },
          ],
          as: 'students',
        },
      },
      {
        $project: {
          totalStudentsIntake: 1,
          branches: 1,
          students: {
            $filter: {
              input: '$students',
              cond: {
                $eq: ['$$this._id', '$_id'],
              },
            },
          },
        },
      },
      {
        $unwind: { path: '$students', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          totalStudentsIntake: 1,
          branches: 1,
          students: {
            $ifNull: ['$students', null, { _id: '$_id', totalStudents: 0 }],
          },
        },
      },
      {
        $project: {
          _id: 0,
          batch: '$_id',
          branches: '$branches',
          totalStudents: '$students.totalStudents',
          totalStudentsIntake: 1,
          availableIntake: {
            $subtract: ['$totalStudentsIntake', '$students.totalStudents'],
          },
        },
      },
    ]);
  } catch (err) {
    throw new HttpException(500, ANALYTICS_ERROR_CODES.AUTH_FAILED, 'AUTH_FAILED', err, null);
  }
}
