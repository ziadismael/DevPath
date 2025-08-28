import {models} from "../models/index.models.js";

class InterviewClass {
    constructor(userID) {
        this._userID = userID;
        this._questionsList = [];
        this._status = '';
        this._score = null;
        this._interviewID = null;
    }
}

export class TechMockInterview extends InterviewClass {
    constructor( userID) {
        super(userID);
    }
    addQuestion(problemID) {
        this.questionsList.push(problemID);
    }

    async saveToDB(){
        const newInterview = await models.Interview.create({
            userID: this._userID,
            score: this._score,
            weakPoints: null,
            typeOfInterview: 'Tech',
            transcript: null
        });
        this._interviewID = newInterview.interviewID;
    }
}


export class HRMockInterview extends InterviewClass {
    constructor(userID) {
        super(userID);

    }
    addQuestion(questionText) {
        this.questionsList.push(questionText);
    }

   async saveToDB(){
        const newInterview = await models.Interview.create({
            userID: this._userID,
            score: this._score,
            weakPoints: null,
            typeOfInterview: 'HR',
            transcript: null
        });
        this._interviewID = newInterview.interviewID;
    }

}