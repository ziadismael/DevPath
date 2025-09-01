import {models} from "../models/index.models.js";
import * as console from "node:console";
import {Error} from "sequelize";

class InternshipClass {
    constructor(title, description, company, application) {
        this._description = description;
        this._title = title;
        this._company = company;
        this._application = application;
        this._mediaURL = null;
        this._internshipID = null;
    }

    async saveToDB(){
        const currentInternship = await models.Internship.create({
            description: this._description,
            company: this._company,
            application: this._application,
            mediaURL: this._mediaURL,
            title: this._title,
        });
        if (currentInternship) {
            console.log("Internship has been created successfully: ", currentInternship);
            this._internshipID = currentInternship.internshipID;
        }
    }

    async saveUpdates(){
        const currentInternship = await models.Internship.findByPk(this._internshipID);
        if (!currentInternship) {
            throw new Error("Internship does not exist yet!");
        }
        currentInternship.title = this._title;
        currentInternship.company = this._company;
        currentInternship.mediaURL = this._mediaURL;
        currentInternship.internshipID = this._internshipID;
        currentInternship.applyLink = this._application;
        currentInternship.description = this._description;

        await currentInternship.save();
    }


    get title() {
        return this._title;
    }
    get description() {
        return this._description;
    }
    get company() {
        return this._company;
    }
    get application() {
        return this._application;
    }
    get mediaURL() {
        return this._mediaURL;
    }
    get internshipID() {
        return this._internshipID;
    }

    async setTitle(title) {
        if (typeof title !== "string") {
            throw new Error("title must be a string");
        }
        this._title = title;
        await this.saveUpdates();
    }
    async setCompany(company) {
        if (typeof company !== "string") {
            throw new Error("company must be a string");
        }
        this._company = company;
        await this.saveUpdates();
    }
    async setApplication(application) {
        if (typeof application !== "string") {
            throw new Error("application must be a string");
        }
        this._application = application;
        await this.saveUpdates();
    }
    async setMediaURL(mediaURL) {
        if (typeof mediaURL !== "string") {
            throw new Error("mediaURL must be a string");
        }
        this._mediaURL = mediaURL;
        await this.saveUpdates();
    }
    async setDescription(description) {
        if (typeof description !== "string") {
            throw new Error("description must be a string");
        }
        this._description = description;
        await this.saveUpdates();
    }

}


export default InternshipClass;