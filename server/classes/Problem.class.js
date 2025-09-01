import {models} from '../models/index.models.js';

class ProblemQuestion {
    constructor(title, difficulty) {
        this._title = title;
        this._difficulty = difficulty;
        this._description = "";
    }

    async saveToDB(){
        const currentProblem = await models.Question.create({
            title: this._title,
            difficulty: this._difficulty,
            description: this._description,
        });
        if (currentProblem) {
            this._problemID = currentProblem.problemID;
            console.log("Saved Successfully into DB!");
        }
    }
}

export default ProblemQuestion;