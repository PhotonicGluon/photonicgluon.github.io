// Get all projects in the projects folder
let projectsList = $("#projects-list");

function processData(data) {
    // Obtain projects that match the filtering condition
    let projects = [];

    let filterCondition = new URLSearchParams(window.location.search).get("filter");
    for (let key in data) {
        if (filterCondition != null) {
            if (data[key]["tags"].includes(filterCondition)) {
                data[key]["id"] = key;
                projects.push(data[key]);
            }
        } else {
            projects.push(data[key]);
        }
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
                    <span class="project-name">${projectInfo['name']}</span>`;

        // Add tags
        projectInfo["tags"].forEach((tag) => {
            outputHTML += `<span class="project-tag">${capitalize(tag)}</span>`;
        });
        outputHTML += "</div>";

        // Date configuration
        outputHTML += `<span class="project-date">${projectInfo['start_date']}`;
        if (projectInfo["end_date"] != null) {
            outputHTML += ` &mdash; ${projectInfo["end_date"]}`
        }
        outputHTML += "</span><br><br>";

        outputHTML += `<span>${projectInfo['summary']}</span><br><br>
                <a href="/project?id=${projectInfo['id']}" class="button project-button-read-more">Read More</a>`;
        if (projectInfo["website_url"] != null) {
            outputHTML += `<a href="${projectInfo['website_url']}" target="_blank" class="button project-button-website">
                Project Website
                </a>`;
        }
        outputHTML += `</div></div>`;

        projectsList.append(`<li>${outputHTML}</li>`);
    }

    projectsList.find(".project-tag").each((i, obj) => addColourToTag(obj));
}

$.ajax(PROJECTS_FILE, {success: processData});
