import {Router} from 'express';
import {syncJobs, getInternship, getAllInternships, applyToInternship, createInternship, updateInternship, deleteInternship} from '../controllers/internship.controller.js';
import { authorize, authorizeAdmin} from "../middlewares/auth.middleware.js";

const internshipRouter = Router();

// Public: browse internships
internshipRouter.get('/', getAllInternships);
internshipRouter.get('/:internshipID', getInternship);

// Applications
internshipRouter.post('/:internshipID/apply', applyToInternship);

// Reviews
// internshipRouter.post('/:internshipID/reviews', writeReview);

// CRUD for internship listings (admin/employer only)
internshipRouter.post('/', authorize, authorizeAdmin, createInternship);
internshipRouter.put('/:internshipID', authorize, authorizeAdmin, updateInternship);
internshipRouter.delete('/:internshipID', authorize, authorizeAdmin, deleteInternship);

// Qstash Scheduling
internshipRouter.post('/sync', syncJobs)
export default internshipRouter;