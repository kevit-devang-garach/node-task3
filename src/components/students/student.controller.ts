import mongoose from 'mongoose';
import { Response, Request, NextFunction } from 'express';
import HttpException from '../../utils/error.utils';
import Student, {  } from './student.model';
import { checkVacantSeats, createNewStudent } from './student.DAL';
class StudentController{
    async add(req: Request, res: Response, next: NextFunction){
        try{
            console.log("try")
            const { name, department, year, semester, admissionDate, mobile, address, UIDAI, isActive } = req.body;
            if(req && req.user && (!req.user.isActive || !req.user.isAdmin)){
                console.log("inside if")
                throw Error("USER IS NOT AUTHORIZED")
            }
            
            const studentObject: any = { name, department, year, semester, admissionDate, mobile, address, UIDAI, isActive } ;
            // console.log("check vacntseats console",(await checkVacantSeats(studentObject.department, studentObject.year)));

            if(!await checkVacantSeats(studentObject.department, studentObject.year)){
                console.log("checkVacantSeat");
                return next("Housefull");
            }
            console.log("before update",studentObject.department)
            studentObject.department = new mongoose.Types.ObjectId(studentObject.department);
            console.log("after update",studentObject.department)
            const student = await createNewStudent(studentObject);
            return res.status(201).send(student);
        }
        catch(err){
            console.log("error:", err)
            return next(err);
        }
    }
}
export default StudentController;