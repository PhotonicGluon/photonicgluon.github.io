// Get required elements
let featuredProjectsContainer = $("#featured-projects-container");

// Add featured projects to index
$(document).ready(() => $.ajax(PROJECTS_FILE, {
    success: (data) => {
        projects = data;

        // Add "id" to projects
        for (let key in projects) projects[key]["id"] = key;

        // Get featured projects
        let featuredProjects = [];
        for (let key in projects) {
            if (projects[key]["featured"] > 0) {  // If 0, then is not featured
                featuredProjects.push(projects[key]);
            }
        }

        // Sort by the "featured" attribute
        featuredProjects.sort((a,b) => a["featured"] - b["featured"]);
        console.log(featuredProjects)

        // Add the featured projects to the index page
        for (let i in featuredProjects) {
            let projectInfo = featuredProjects[i];

            let outputHTML = `<div class="featured-entry">`;
            outputHTML += `<a href="/project?id=${projectInfo['id']}" target="_blank">`
            outputHTML += `<figure>`

            // Add banner if possible
            outputHTML += `<div class="featured-entry-image">`
            if (projectInfo["banner"] != null) {
                outputHTML += `<img src="${projectInfo['banner']}" alt="${projectInfo['name']} Banner">`;
            } else {
                outputHTML += `<img src="/assets/resources/img/no-image.webp" alt="No Image">`;
            }
            outputHTML += `</div>`

            // Add project tags
            outputHTML += "<div class='project-tags'>"
            projectInfo["tags"].forEach((tag) => {
                outputHTML += `<span class="project-tag">${capitalize(tag)}</span> `;
            });
            outputHTML += "</div>";

            // Add summary
            outputHTML += `<figcaption>${projectInfo['summary']}</figcaption>`;
            outputHTML += `</figure></a></div>`

            featuredProjectsContainer.append(`${outputHTML}`);
        }

        featuredProjectsContainer.find(".project-tag").each((i, obj) => addColourToTag(obj));
    }
}));
