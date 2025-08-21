import {Router} from 'express';
import questionController from '../controllers/question.controller.js';

const questionRouter = Router();

//CRUD for admins
questionRouter.get('/', questionController.getAllProblems);
questionRouter.post('/', questionController.createProblem);
questionRouter.put('/:problemID', questionController.editProblem);
questionRouter.delete('/:problemID', questionController.deleteProblem);

// Browse for User
questionRouter.get('/:problemID', questionController.getProblem);
questionRouter.post('/:problemID', questionController.submitSolution);
questionRouter.get('/me/', questionController.getAttemptedProblems);

export default questionRouter;