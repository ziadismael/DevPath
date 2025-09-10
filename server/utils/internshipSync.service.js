import InternshipClass from "../classes/Internship.class.js";
import {scrapeJobs} from "jobScraper.service.js";

export async function importLinkedinJobs({ keyword, location, limit = 10, filters = {} }) {
    const scrapedJobs = await scrapeJobs({ keyword, location, limit, filters });
    // TEMP: return scrapedJobs directly to avoid class/db crash
    // return scrapedJobs;
    return await InternshipClass.bulkCreateFromScrapedJobs(scrapedJobs);
}
