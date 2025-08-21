import {Router} from 'express';
import {internshipController} from '../controllers/internship.controller.js';

const internshipRouter = Router();

// Public: browse internships
internshipRouter.get('/', internshipController.getAllInternships);
internshipRouter.get('/:internshipID', internshipController.getInternship);

// Applications
internshipRouter.post('/:internshipID/apply', internshipController.applyToInternship);

// Reviews
internshipRouter.post('/:internshipID/reviews', internshipController.writeReview);

// CRUD for internship listings (admin/employer only)
internshipRouter.post('/', internshipController.createInternship);
internshipRouter.put('/:internshipID', internshipController.updateInternship);
internshipRouter.delete('/:internshipID', internshipController.deleteInternship);

export default internshipRouter;