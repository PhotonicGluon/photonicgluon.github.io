// Retrieve project data
let projectID = new URLSearchParams(window.location.search).get("id");
let baseURL = PROJECTS_FOLDER + projectID + "/";
let queryURL = baseURL + projectID + ".json";

$.ajax(queryURL, {
    success: (data) => {
        // Update main details
        $("title").text("Overwrite - " + data["name"]);
        $("#hero-box-project-name").text(data["name"]);
        $("#hero-box-project-duration").html(data["duration"]);
        $("#project-banner-image").html(`<img src="${data['banner']}" alt="${data['name']} Banner">`);

        // Add links
        let projectLinks = $("#project-links");
        if (data["github_url"]) projectLinks.append(`<li>
            <a href="${data['github_url']}" title="Link to GitHub">
                <img src="static/vendors/img/github-mark-white.svg" alt="GitHub Icon">
            </a>
        </li>`);
        if (data["website_url"]) projectLinks.append(`<li>
            <a href="${data['website_url']}" title="Link to Website">
                <img src="static/vendors/img/internet.svg" alt="Website Icon">
            </a>
        </li>`);

        // Retrieve the actual data to show
        if (data["webpage_type"] === "markdown") {
            $.ajax(baseURL + projectID + ".md", {
                success: (code) => {
                    let converter = new showdown.Converter();
                    let outputHTML = converter.makeHtml(code);
                    $("#project-desc").html(outputHTML);
                }
            });
        } else {
            // Todo handle HTML type
        }
    },
    error: (msg) => {
        $("title").text("Project Not Found");
        $("#hero-box-project-name").text("Project Not Found");
    }
});
