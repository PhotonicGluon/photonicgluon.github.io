// Retrieve project data
let projectID = new URLSearchParams(window.location.search).get("id");
let baseURL = PROJECTS_FOLDER + projectID + "/";

$.ajax(PROJECTS_FILE, {
    success: (data) => {
        let project = data[projectID];

        let title = $("title");
        let heroBoxProjectName = $("#hero-box-project-name");
        if (project == null) {
            title.text("Project Not Found");
            heroBoxProjectName.text("Project Not Found");
            return;
        }

        // Update main details
        title.text("Overwrite - " + project["name"]);
        heroBoxProjectName.text(project["name"]);
        $("#hero-box-project-start-date").text(project["start_date"]);
        $("#hero-box-project-end-date").text(project["end_date"]);
        $("#project-banner-image").html(`<img src="${project['banner']}" alt="${project['name']} Banner">`);

        // Add tags
        let projectTags = $("#project-tags");
        console.log(project["tags"]);
        for (let i in project["tags"]) {
            projectTags.append(`<span class="project-tag" id="tag-${i}">${capitalize(project["tags"][i])}</span>`);
            addColourToTag(document.getElementById(`tag-${i}`));
        }

        // Add links
        let projectLinks = $("#project-links");
        if (project["github_url"]) projectLinks.append(`<li>
            <a href="${project['github_url']}" title="Link to GitHub">
                <img src="static/vendors/img/github-mark-white.svg" alt="GitHub Icon">
            </a>
        </li>`);
        if (project["website_url"]) projectLinks.append(`<li>
            <a href="${project['website_url']}" title="Link to Website">
                <img src="static/vendors/img/internet.svg" alt="Website Icon">
            </a>
        </li>`);

        // Retrieve the actual data to show
        if (project["page_type"] === "markdown") {
            $.ajax(baseURL + projectID + ".md", {
                success: (code) => {
                    let converter = new showdown.Converter();
                    let outputHTML = converter.makeHtml(code);
                    $("#project-desc").html(outputHTML);
                }
            });
        } else {
            $.ajax(baseURL + projectID + ".html", {
                success: (code) => $("#project-desc").html(code)
            });
        }
    }
});
