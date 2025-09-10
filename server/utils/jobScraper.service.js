import { createRequire } from "module";
const require = createRequire(import.meta.url);

const linkedin = require("linkedin-jobs-api");

export async function scrapeJobs({ keyword, location, limit = 10, filters = {} }) {
    try {
        const jobs = await linkedin.query({
            keyword,
            location,
            limit,
            filters,
        });
        return jobs;
    } catch (err) {
        console.error("Error scraping jobs:", err);
        return [];
    }
}
