// Get all projects in the projects folder
const PROJECTS_FILE = "projects.json";
let projectsList = $("#projects-list");

function processData(data) {
    // Obtain projects that match the filtering condition
    let projects = [];

    let filterCondition = new URLSearchParams(window.location.search).get("filter");
    if (filterCondition != null) {
        let initLength = data.length;
        for (let i = 0; i < initLength; i++) {
            if (data[i]["tag"] === filterCondition) projects.push(data[i]);
        }
    } else {
        projects = data;
    }

    let numProjects = projects.length;

    // If there are no projects, report that to the user
    if (numProjects === 0) {
        let projectsSection = $("#projects");
        projectsSection.html(
            `<p style="text-align: center">No projects matching the requested filter were found.</p>`
        );
        projectsSection.css("padding-bottom", 0);
        return;
    }

    // Sort projects by end date (in reverse chronological order)
    projects.sort((a, b) => {
        let date1 = a["end_date"];
        let date2 = b["end_date"];

        // Place "Present" projects (i.e., projects that are ongoing) at the start of the list
        if (date1 === "Present" && date2 === "Present") {
            // If both are currently worked on, sort by name (in ascending order)
            let name1 = a["name"];
            let name2 = b["name"];

            if (name1 > name2) {
                return 1;
            } else if (name1 < name2) {
                return -1;
            } else {
                return 0;
            }
        } else if (date1 === "Present") {
            return -1;
        } else if (date2 === "Present") {
            return 1;
        } else {
            return new Date(date2) - new Date(date1);
        }
    });

    // Then add projects to the webpage
    for (let i = 0; i < numProjects; i++) {
        let projectInfo = projects[i];

        let outputHTML =
            `<div class="project-entry">
            <div class="project-entry-image">
                <img src="${projectInfo['banner']}" alt="${projectInfo['name']} Banner">
            </div>
            <div class="project-entry-description">
                <div class="project-entry-description-head">
                    <span class="project-name">${projectInfo['name']}</span>
                    <span class="project-tag">${capitalize(projectInfo['tag'])}</span>
                </div>`;

        // Date configuration
        outputHTML += `<span class="project-date">${projectInfo['start_date']}`;
        if (projectInfo["end_date"] != null) {
            outputHTML += ` &mdash; ${projectInfo["end_date"]}`
        }
        outputHTML += "</span><br><br>";

        outputHTML += `<span>${projectInfo['summary']}</span><br><br>
                
                <!-- Todo add -->
                <a href="#" class="button project-button-read-more">Read More</a>`;
        if (projectInfo["url"] != null) {
            outputHTML += `<a href="${projectInfo['url']}" target="_blank" class="button project-button-webpage">
                Project Webpage
                </a>`;
        }
        outputHTML += `</div></div>`;

        projectsList.append(`<li>${outputHTML}</li>`);
    }

    // Configure colours for labels
    projectsList.find(".project-tag").each((i, obj) => {
        $(obj).addClass(`project-tag-${obj.innerText.toLowerCase()}`);
    });
}

$.ajax(PROJECTS_FOLDER + PROJECTS_FILE, {success: processData});
