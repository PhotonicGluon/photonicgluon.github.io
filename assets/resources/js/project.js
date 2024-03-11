// Retrieve project data
let pageURL = window.location.href;
pageURL = pageURL.replace(/(?:\/|\.html)$/, "")
let projectID = pageURL.substring(pageURL.lastIndexOf("/") + 1);

$.ajax(PROJECTS_FILE, {
    success: (data) => {
        let project = data[projectID];

        // Update main details
        $("#hero-box-project-name").text(project["name"]);
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
    }
});
