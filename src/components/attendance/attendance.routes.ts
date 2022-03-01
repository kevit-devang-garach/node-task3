import { Router } from "express";
import AttedanceController from "./attendance.controller";
import { authenticateMiddleware} from "../../middleware/auth.middleware";
import { validateRequestMiddleware } from "../../middleware/error.middleware";
import { addAttendanceSchema } from "./attendance.model";

class Attendance {
    path = '/attendance';
    router = Router();

    attendanceController = new AttedanceController();
    constructor(){
        this.initializeRoutes()
    }
    initializeRoutes(){
        this.router.post(`${this.path}/add`,authenticateMiddleware.authorize, validateRequestMiddleware(addAttendanceSchema), this.attendanceController.add)
    }
}
export default Attendance;