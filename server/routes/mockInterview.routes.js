import {Router} from 'express';
import interviewController from '../controllers/interview.controller.js';

const interviewRouter = Router();

// CRUD Operations
interviewRouter.post('/', interviewController.conductInterview);
interviewRouter.get('/:interviewID', interviewController.getResult);
interviewRouter.get('/me/', interviewController.getPrevInterviews);


export default interviewRouter;