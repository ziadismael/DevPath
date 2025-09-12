import {models} from "../models/index.models.js";
import * as console from "node:console";
import {Error} from "sequelize";

class InternshipClass {
    constructor(data) {
        this.internshipID = data.internshipID
        this.title = data.title;
        this.company = data.company;
        this.location = data.location;
        this.workplaceType = data.workplaceType;
        this.mediaURL = data.mediaURL;
        this.applyLink = data.applyLink;
    }

    static async create(internshipBodyData) {
        const internshipRecord = await models.Internship.create(internshipBodyData);
        if (!internshipRecord) {
            throw new Error("Error creating Internship");
        }
        // 2. Return a new instance of our class, using the data from the record we just created
        return new InternshipClass(internshipRecord.toJSON());
    }

    static async createFromScrapedJob(job) {
        const jobUrl = job.jobUrl;

        if (!jobUrl) {
            // If there's no URL, we can't use it as a unique identifier, so we skip it.
            console.warn("Skipping job with no URL:", job.position);
            return null;
        }

        const [internship] = await models.Internship.findOrCreate({
            where: { applyLink: jobUrl },  // prevent duplicates
            defaults: {
                title: job.position,
                company: job.company,
                description: job.description,
                location: job.location,
                mediaURL: job.companyLogo || null,
                applyLink: jobUrl,
            },
        });

        return new InternshipClass(internship);
    }

    static async bulkCreateFromScrapedJobs(jobs) {
        return Promise.all(jobs.map(job => this.createFromScrapedJob(job)));
    }

    async saveToDB(){
        const currentInternship = await models.Internship.create({
            description: this.description,
            company: this.company,
            application: this.application,
            mediaURL: this.mediaURL,
            title: this.title,
        });
        if (currentInternship) {
            console.log("Internship has been created successfully: ", currentInternship);
            this.internshipID = currentInternship.internshipID;
        }
    }

    async saveUpdates(){
        const currentInternship = await models.Internship.findByPk(this.internshipID);
        if (!currentInternship) {
            throw new Error("Internship does not exist yet!");
        }
        currentInternship.title = this.title;
        currentInternship.company = this.company;
        currentInternship.mediaURL = this.mediaURL;
        currentInternship.internshipID = this.internshipID;
        currentInternship.applyLink = this.application;
        currentInternship.description = this.description;

        await currentInternship.save();
    }

    // ---- Static methods for fetching ----
    static async findById(id) {
        const internship = await models.Internship.findByPk(id);
        return internship ? new InternshipClass(internship.toJSON()) : null;
    }

    static async findAll(options = {}) {
        const internshipRecords = await models.Internship.findAll(options);
        // Map over the raw records, convert to plain objects, and wrap each in our class
        return internshipRecords.map(record => new InternshipClass(record.toJSON()));
    }

    //
    // get title() {
    //     return this._title;
    // }
    // get description() {
    //     return this._description;
    // }
    // get company() {
    //     return this._company;
    // }
    // get application() {
    //     return this._application;
    // }
    // get mediaURL() {
    //     return this._mediaURL;
    // }
    // get internshipID() {
    //     return this._internshipID;
    // }
    //
    // async setTitle(title) {
    //     if (typeof title !== "string") {
    //         throw new Error("title must be a string");
    //     }
    //     this._title = title;
    //     await this.saveUpdates();
    // }
    // async setCompany(company) {
    //     if (typeof company !== "string") {
    //         throw new Error("company must be a string");
    //     }
    //     this._company = company;
    //     await this.saveUpdates();
    // }
    // async setApplication(application) {
    //     if (typeof application !== "string") {
    //         throw new Error("application must be a string");
    //     }
    //     this._application = application;
    //     await this.saveUpdates();
    // }
    // async setMediaURL(mediaURL) {
    //     if (typeof mediaURL !== "string") {
    //         throw new Error("mediaURL must be a string");
    //     }
    //     this._mediaURL = mediaURL;
    //     await this.saveUpdates();
    // }
    // async setDescription(description) {
    //     if (typeof description !== "string") {
    //         throw new Error("description must be a string");
    //     }
    //     this._description = description;
    //     await this.saveUpdates();
    // }

}


export default InternshipClass;