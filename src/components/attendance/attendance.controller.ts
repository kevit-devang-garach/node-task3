import { Response, Request, NextFunction } from "express";
import HttpException from "../../utils/error.utils";
import { ATTENDANCE_ERROR_CODES } from "./attendance.error";
import { createAttendanceRecord } from "./attendance.DAL";
class AttedanceController{
    async add(req: Request, res: Response, next: NextFunction){
        console.log("trying to add attendance record");
        try{
            const { userId, department, year, semester, absentDate, reason } = req.body;
            if (req && req.user && !req.user.isActive) {
                console.log('inside if');
                throw Error('USER IS NOT AUTHORIZED');
            }
            const attendanceObject = { userId, department, year, semester, absentDate, reason };
            const attendace = await createAttendanceRecord(attendanceObject);
            console.log('attendance record created', attendace);
            return res.status(201).send(attendace);
        } catch (err) {
            throw new HttpException(500, ATTENDANCE_ERROR_CODES.CREATE_ATTENDANCE_UNHANDLED_IN_DB, 'CREATE_ATTENDANCE_UNHANDLED_IN_DB', err, null);
        }
    }
}

export default AttedanceController;