// Get required elements
let projectsList = $("#projects-list");

let filterTags = $("#filter-tags");
let filterDate = $("#filter-date");
let filterOrder = $("#filter-order");

let projects = [];

// Add tag options to filtering
filterTags.append("<option value='all' selected>All</option>");
for (let tag in TAGS) filterTags.append(`<option value=${tag}>${capitalize(tag)}</option>`);

// Update project list on filter condition changes
function updateProjectList() {
    // Get selected options
    let selectedTag = filterTags.find(":selected").val();
    let selectedDate = filterDate.find(":selected").val();
    let selectedOrder = filterOrder.find(":selected").val();

    console.log(selectedTag, selectedDate, selectedOrder);

    // Clear existing projects
    projectsList.children().remove();

    // Obtain projects that match the filtering condition
    let relevantProjects = [];

    for (let key in projects) {
        if (selectedTag !== "all") {
            if (projects[key]["tags"].includes(selectedTag)) {
                relevantProjects.push(projects[key]);
            }
        } else {
            relevantProjects.push(projects[key]);
        }
    }
    console.log(projects, relevantProjects);

    let numProjects = relevantProjects.length;

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
    relevantProjects.sort((a, b) => {
        let date1 = a[selectedDate];
        let date2 = b[selectedDate];
        let dateDifference = new Date(date1) - new Date(date2);

        if (selectedDate === "start_date") {
            return selectedOrder === "ascending" ? dateDifference : -dateDifference;
        } else {
            // Place "Present" projects (i.e., projects that are ongoing) at the start of the list
            if (date1 === "Present" && date2 === "Present") {
                // If both are currently worked on, sort by name (in ascending order)
                let name1 = a["name"];
                let name2 = b["name"];

                if (name1 > name2) {
                    return selectedOrder === "ascending" ? -1 : 1;
                } else if (name1 < name2) {
                    return selectedOrder === "ascending" ? 1 : -1;
                } else {
                    return 0;
                }
            } else if (date1 === "Present") {
                return selectedOrder === "ascending" ? 1 : -1;
            } else if (date2 === "Present") {
                return selectedOrder === "ascending" ? -1 : 1;
            } else {
                return selectedOrder === "ascending" ? dateDifference : -dateDifference;
            }
        }
    });

    // Then add projects to the webpage
    for (let i = 0; i < numProjects; i++) {
        let projectInfo = relevantProjects[i];
        let outputHTML = `<div class="project-entry"><div class="project-entry-image">`;

        // Add banner if possible
        if (projectInfo["banner"] != null) {
            outputHTML += `<img src="${projectInfo['banner']}" alt="${projectInfo['name']} Banner">`;
        } else {
            outputHTML += `<img src="/static/resources/img/no-image.jpg" alt="No Image">`;
        }
        outputHTML += "</div>";

        // Add project name
        outputHTML += `<div class="project-entry-description">
                            <div class="project-entry-description-head">
                            <span class="project-name">${projectInfo['name']}</span>`;

        // Add tags
        outputHTML += "<div class='project-tags'>"
        projectInfo["tags"].forEach((tag) => {
            outputHTML += `<span class="project-tag">${capitalize(tag)}</span>`;
        });
        outputHTML += "</div></div>";

        // Date configuration
        outputHTML += `<span class="project-date">${projectInfo['start_date']}`;
        if (projectInfo["end_date"] != null) {
            outputHTML += ` &mdash; ${projectInfo["end_date"]}`
        }
        outputHTML += "</span>";

        outputHTML += `<span class="project-summary">${projectInfo['summary']}</span>`;

        // End button configuration
        outputHTML += `<div class="project-buttons">
                        <a href="/project?id=${projectInfo['id']}" class="button project-button-read-more">Read More</a>`;
        if (projectInfo["bandcamp_url"]) {
            outputHTML += `<a href="${projectInfo['bandcamp_url']}" target="_blank" class="button project-button-bandcamp">
                Bandcamp
                </a>`;
        }
        if (projectInfo["website_url"] != null) {
            outputHTML += `<a href="${projectInfo['website_url']}" target="_blank" class="button project-button-website">
                Project Website
                </a>`;
        }
        outputHTML += `</div></div></div>`;

        projectsList.append(`<li>${outputHTML}</li>`);
    }

    projectsList.find(".project-tag").each((i, obj) => addColourToTag(obj));
}
[filterTags, filterDate, filterOrder].forEach((item) => item.change(updateProjectList));

$(document).ready(() => {
    // Select correct tag filter based on argument
    let filterCondition = new URLSearchParams(window.location.search).get("filter");
    if (filterCondition) {
        filterTags.val(filterCondition);
    }

    // Get all projects in the projects folder
    $.ajax(PROJECTS_FILE, {
        success: (data) => {
            projects = data;

            // Add "id" to projects
            for (let key in projects) {
                projects[key]["id"] = key;
            }
            updateProjectList();
        }
    });
})
