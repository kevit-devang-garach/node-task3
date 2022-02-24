import { Router } from "express";
import { authenticateMiddleware } from "../../middleware/auth.middleware";
import { validateRequestMiddleware } from "../../middleware/error.middleware";
import BatchController from "./batch.controller";
import { addBatchSchema } from "./batch.model";

class BatchRoute{
    path="/batch";
    router = Router();
    batchController = new BatchController();
    constructor(){
        console.log("Batch Route Constructor");
        this.initializeRoutes();
        
    }
    initializeRoutes() {
        this.router.post(`${this.path}/create`, authenticateMiddleware.authorize, validateRequestMiddleware(addBatchSchema), this.batchController.create)
    }
}

export default BatchRoute;