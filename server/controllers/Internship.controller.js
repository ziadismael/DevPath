import {importLinkedinJobs} from "../utils/internshipSync.service.js";
import  InternshipClass from "../classes/Internship.class.js";
import {models} from "../models/index.models.js";


export const syncJobs = async (req, res, next) => {
    try {
        const { keyword, location, limit = 10 } = req.query;
        const internships = await importLinkedinJobs({
            keyword,
            location,
            limit: Number(limit),
            // filters: { remoteFilter: "remote" }
        });
        res.json({
            success: true,
            count: internships.length,
            message: `Imported ${internships.length} internships`,
            data: internships,
        });
    } catch (err) {
        next(err);
    }
}


export const getInternship = async (req, res, next) => {
    try {
        const internship = await InternshipClass.findById(req.params.id);
        res.status(200).json({
            title: internship.title,
            company: internship.company,
            description: internship.description,
            location: internship.location,
            mediaURL: internship.mediaURL || null,
            applyLink: internship.applyLink,
        });
    }
    catch (error) {
        next(error);
    }
}

export const getAllInternships = async (req, res, next) => {
    try {
        const internships = await InternshipClass.findAll();
        res.status(200).json({
            success: true,
            count: internships.length,
            data: internships
        });
    }
    catch (error) {
        next(error);
    }
}

export const createInternship = async (req, res, next) => {
    try {
        const internship = await InternshipClass.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Internship created successfully',
            data: internship,
        });
    }
    catch (error) {
        next(error);
    }
}
export const updateInternship = async (req, res, next) => {
    try{
        const internshipToUpdate = await InternshipClass.findById(req.params.id);
        if(!internshipToUpdate){
            throw new Error(`Error updating Internship, cannot locate internship ${req.params.id}`);
        }
        const { title, company, description, location, mediaURL, applyLink } = req.body;
        internshipToUpdate.company = req.params.company;
        let currentInternshipObj = new InternshipClass(internshipToUpdate);
        currentInternshipObj.title = title;
        currentInternshipObj.company = company;
        currentInternshipObj.description = description;
        currentInternshipObj.location = location;
        currentInternshipObj.applyLink = applyLink;
        currentInternshipObj.mediaURL = mediaURL;
        await currentInternshipObj.saveUpdates();
        res.status(200).json({
            success: true,
            message: 'Updated Internship Successfully',
            data: currentInternshipObj,
        })
    }
    catch (error) {
        next(error);
    }
}

export const deleteInternship = async (req, res, next) => {
    try{
        const internshipToDelete = await InternshipClass.findById(req.params.id);
        if(!internshipToDelete){
            throw new Error(`Internship ${req.params.id} not found`);
        }
        await models.Internship.destroy({ where: { internshipID: internshipToDelete.internshipID } });
        res.status(200).json({
            success: true,
            message: "Internship deleted successfully",
        })
    }
    catch (error) {
        next(error);
    }
}

export const applyToInternship = async (req, res, next) => {
    try{
       const currentUser = req.user;
       const currentInternship = await InternshipClass.findById(req.params.id);
       if(!currentInternship){
           throw new Error(`Internship ${req.params.id} not found`);
       }
        await currentUser.applyToInternship(req.params.id);
        res.status(200).json({ applyLink: currentInternship.applyLink });
    } catch (error) {
        next(error);
    }
}