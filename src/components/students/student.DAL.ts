import HttpException from '../../utils/error.utils';
import Departments from '../departments/department.model';
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
    const departmentObject: any = await Departments.findById(department);
    console.log('department object inder check vacant seats', departmentObject);
    let totalIntake;
    for (let batchNo = 0; batchNo < departmentObject.batches.length; batchNo++) {
      console.log('forloop');
      if (departmentObject.batches[batchNo].year === year) {
        console.log('under if condtion ', departmentObject.batches[batchNo].year, year);
        totalIntake = departmentObject.batches[batchNo].totalIntake;
      }
    }
    console.log('total intake', totalIntake);
    const totalActiveStudInDept = await Student.aggregate([
      {
        $match: { department: departmentObject._id, isActive: true },
      },
      {
        $count: 'totalStudInDept',
      },
    ]);
    console.log('totalActiveStudInDept', totalActiveStudInDept);
    // Student.findOne({ department: departmentObject._id, isActive:true}).count();

    if(totalActiveStudInDept.length){
      return totalIntake >=  totalActiveStudInDept[0].totalStudInDept;
    }
    return true;
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
