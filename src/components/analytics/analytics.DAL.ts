
import mongoose from 'mongoose';
import HttpException from "../../utils/error.utils";
import Attendance from "../attendance/attendance.model";
import Batches from "../batches/batch.model";
import Student from "../students/student.model";

import { ANALYTICS_ERROR_CODES } from "./analytics.error";

export async function findBranchesOrdByTotalStudents(){
    try {
        return await Batches.aggregate([
            {
                $unwind:'$branches'
            },
            {
                $group:{
                    _id:'$year',
                    branches: {
                        $push: '$branches'
                        },
                    totalStudents: { $sum: '$branches.totalStudentsIntake'}
                }        
            },
            {
                $sort:{
                    totalStudents: -1
                }
            }
        ])
        
      } catch (err) {
        throw new HttpException(500, ANALYTICS_ERROR_CODES.AUTH_FAILED, 'AUTH_FAILED', err, null);
      }
}

export async function listOfAbsentStudents(year:number, absentdate: string, semester: number, department: string){
    console.log(new mongoose.Types.ObjectId(department),department)
    console.log(year,semester)
    try{
       return await Attendance.aggregate([
            {
                $match: {
                    absentDate: new Date(absentdate)
                }
            },
            {
                $lookup: {
                    from: 'students',
                    localField: 'userId',
                    foreignField: '_id',
                    as:'studentDetails'
                }
            },
            {
                $unwind: "$studentDetails"
            },
            {
                $match:{
                    "studentDetails.year":year,
                    "studentDetails.semester": semester,
                    "studentDetails.department": new mongoose.Types.ObjectId(department)
                    }
                },
            {
                $project: { 
                    name: "$studentDetails.name", 
                    _id: 0
                }
            }
        ])
    }
    catch(err){
        throw new HttpException(500, ANALYTICS_ERROR_CODES.AUTH_FAILED, 'AUTH_FAILED', err, null);
    }
}

export async function listOfAbsentStudentsBelow75Percent(year: number, semester: number, department: string){
    try{
        return await Attendance.aggregate([
            {
                $lookup: {
                    from: 'students',
                    localField: 'userId',
                    foreignField: '_id',
                    as:'studentDetails'
                }
            },
            {
                $unwind: "$studentDetails"
            },
            {
                $match:{
                    "studentDetails.year":year,
                    "studentDetails.semester": semester,
                    "studentDetails.department": new mongoose.Types.ObjectId(department)
                    }
                },
            {
                $group: {
                    _id: ["$studentDetails._id", "$studentDetails.name"],
                    absentDays: {$sum:1}
                }
            },
            { $project: { 
                _id: "$_id",
                name:1,
                absentDays: 1, 
                absentPercentage: { 
                        $multiply:[{$divide:[100,140]},"$absentDays"]
                    }
                }
            },
            {
                $match: {
                    absentPercentage: { $gt: 75 }
                }
            }
        ])
    }
    catch (err) {
        throw new HttpException(500, ANALYTICS_ERROR_CODES.AUTH_FAILED, 'AUTH_FAILED', err, null);
      }
}

export async function listVacantSeats(){
    try {

        const students = await Student.aggregate([
            {
              $sort:{ year : 1, department: 1 }
            },
            {
              $group: {
                _id: { year : "$year",department : "$department" },
                "students": { $sum: 1}
              }
            }
          ])
        return await Batches.aggregate([
            {
                $unwind:'$branches'
            },
            {
                $group:{
                    _id:'$year',
                    branches: {
                        $push: '$branches'
                        },
                    totalStudents: { $sum: '$branches.totalStudentsIntake'}
                }        
            },
            {
                $sort:{
                    totalStudents: -1
                }
            }
        ])
        
      } catch (err) {
        throw new HttpException(500, ANALYTICS_ERROR_CODES.AUTH_FAILED, 'AUTH_FAILED', err, null);
      }
}
