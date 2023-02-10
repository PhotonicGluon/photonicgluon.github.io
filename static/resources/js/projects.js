// Get all projects in the projects folder
const PROJECTS_FILE = "/static/projects/projects.json";
let projectsList = $("#projects-list");

function processData(data) {
    // Add projects first
    let numProjects = data.length;
    for (let i = 0; i < numProjects; i++) {
        let projectInfo = data[i];

        let outputHTML =
            `<div class="project-entry">
            <div class="project-entry-image">
                <img src="${projectInfo['banner']}" alt="${projectInfo['name']} Banner">
            </div>
            <div class="project-entry-description">
                <div class="project-entry-description-head">
                    <span class="project-name">${projectInfo['name']}</span>
                    <span class="project-tag">${capitalize(projectInfo['tag'])}</span>
                </div>
                <span class="project-date">${projectInfo['date']}</span><br><br>
                <span>${projectInfo['summary']}</span><br><br>
                
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

$.ajax(PROJECTS_FILE, {success: processData});
