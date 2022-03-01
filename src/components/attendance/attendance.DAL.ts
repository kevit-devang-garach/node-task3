import HttpException from "../../utils/error.utils";
import { ATTENDANCE_ERROR_CODES } from "./attendance.error";
import Attendance, { AttendanceDocument } from "./attendance.model";

export async function createAttendanceRecord(attendaceObject: Pick<AttendanceDocument, "department" | "userId" | "year" | "semester" | "absentDate" | "reason">){
    try{
        return await Attendance.create(attendaceObject);
    } catch(err){
        throw new HttpException(500, ATTENDANCE_ERROR_CODES.CREATE_ATTENDANCE_UNHANDLED_IN_DB, 'CREATE_ATTENDANCE_UNHANDLED_IN_DB', err, null)
    }
}