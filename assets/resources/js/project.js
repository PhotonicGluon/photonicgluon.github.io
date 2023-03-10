// Define showdown converter and image wrapping extension
let imageWrapperExt = {
    type: "output",
    filter: (src) => {
        return src.replace(
            /<p><img .+?><\/p>/g,
            (x) => `<div class="image-wrapper">${x.substring(3, x.length - 4)}</div>`
        );
    }
};
showdown.extension("image_wrapper", imageWrapperExt);
let converter = new showdown.Converter({extensions: ["image_wrapper"]});

// Retrieve project data
let projectID = new URLSearchParams(window.location.search).get("id");
let baseURL = PROJECTS_FOLDER + projectID + "/";

$.ajax(PROJECTS_FILE, {
    success: (data) => {
        let project = data[projectID];

        let title = $("title");
        let heroBoxProjectName = $("#hero-box-project-name");
        if (project == null) {
            title.text("Project Not Found | Overwrite");
            heroBoxProjectName.text("Project Not Found");
            $("#hero-box-project-duration").remove();

            let projectSection = $("#project");
            projectSection.children().remove();
            projectSection.css("padding-bottom", "30px");
            projectSection.append(`<span id="project-not-found">The requested project could not be found.</span>`);
            return;
        }

        // Update main details
        title.text(project["name"] + " | Overwrite");
        heroBoxProjectName.text(project["name"]);
        $("#hero-box-project-start-date").text(project["start_date"]);
        $("#hero-box-project-end-date").text(project["end_date"]);

        // Add banner if provided
        if (project["banner"] != null) {
            $("#project-banner-image").html(`<img src="${project['banner']}" alt="${project['name']} Banner">`);
        } else {
            $("#project-banner-image").remove();
        }

        // Add tags
        let projectTags = $("#project-tags");
        for (let i in project["tags"]) {
            projectTags.append(`<span class="project-tag" id="tag-${i}">${capitalize(project["tags"][i])}</span>`);
            addColourToTag(document.getElementById(`tag-${i}`));
        }

        // Add links
        let projectLinks = $("#project-links");
        if (project["bandcamp_url"]) projectLinks.append(`<li>
            <a href="${project['bandcamp_url']}" title="Link to Bandcamp">
                <img src="/assets/vendors/img/bandcamp-button-circle-line-white-256.png" alt="Bandcamp Icon">
            </a>
        </li>`);
        if (project["github_url"]) projectLinks.append(`<li>
            <a href="${project['github_url']}" title="Link to GitHub">
                <img src="/assets/vendors/img/github-mark-white.svg" alt="GitHub Icon">
            </a>
        </li>`);
        if (project["website_url"]) projectLinks.append(`<li>
            <a href="${project['website_url']}" title="Link to Website">
                <img src="/assets/vendors/img/internet.svg" alt="Website Icon">
            </a>
        </li>`);

        // Retrieve the actual data to show
        if (project["page_type"] === "markdown") {
            $.ajax(baseURL + projectID + ".md", {
                success: (code) => {
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
