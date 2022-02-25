import mongoose from 'mongoose';
import HttpException from '../../utils/error.utils';
import Batches from '../batches/batch.model';
// import Departments from '../departments/department.model'
import { STUDENT_ERROR_CODES } from './student.error';
import Student from './student.model';

export async function createNewStudent(studentObject: any) {
  try {
    console.log('createNewStudent function inside DAL file');
    return await Student.create(studentObject);
  } catch (err) {
    console.log('error in catch newcreatestudent');
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
    console.log('createNewStudent function inside DAL file');
    const batchObject: any = await Batches.aggregate([
      {
          $match: { 
              year: 2020,
              branches: {$elemMatch: { department: new mongoose.Types.ObjectId(department), isActive: true }}
              }
          },{
              $project: {
                  'branches': {
                      $filter: {
                      'input': '$branches',
                      'cond': {
                          '$eq': [
                              '$$this.department', new mongoose.Types.ObjectId(department)
                          ]
                      }
                  }
                      }
                  }
              }
      ]);
    console.log('department object inder check vacant seats', batchObject);

    const totalActiveStudInDept = await Student.aggregate([
      {
        $match: { department: new mongoose.Types.ObjectId(department), isActive: true },
      },
      {
        $count: 'totalStudInDept',
      },
    ]);
    console.log('1 totalActiveStudInDept', totalActiveStudInDept);
    // console.log("2",totalActiveStudInDept[0])
    // console.log("3",totalActiveStudInDept[0].totalStudInDept)
    // Student.findOne({ department: department, isActive:true}).count();
    // console.log(typeof batchObject, Object.keys(batchObject).length, batchObject[0],Object.keys(batchObject[0]).length , typeof batchObject[0].branches[0],Object.keys(batchObject[0].branches[0]).length)
    const batchBoolean = Object.keys(batchObject).length && Object.keys(batchObject[0]).length && Object.keys(batchObject[0].branches[0]).length;
    const studBoolean = Object.keys(totalActiveStudInDept).length && Object.keys(totalActiveStudInDept[0]).length;
    console.log(batchBoolean, studBoolean)
    if(batchBoolean){
      console.log("inside if totalstudentintake and totalstudindept")
      return batchObject[0].branches[0].totalStudentsIntake >=  ((studBoolean) ? totalActiveStudInDept[0].totalStudInDept: 0);
    }
    return false;
  } catch (err) {
    console.log('error in catch newcreatestudent');
    throw new HttpException(
      500,
      STUDENT_ERROR_CODES.CREATE_STUDENT_UNHANDLED_IN_DB,
      'CREATE_STUDENT_UNHANDLED_IN_DB',
      err,
      null
    );
  }
}
