// Initialize Showdown converter
let converter = new showdown.Converter();

// Helper functions
function ordinal_suffix(num) {  // Adapted from https://stackoverflow.com/a/13627586
    let tens = num % 10;
    let hundreds = num % 100;

    let suffix = "th";
    if (tens === 1 && hundreds !== 11) {
        suffix = "st";
    }
    if (tens === 2 && hundreds !== 12) {
        suffix = "nd";
    }
    if (tens === 3 && hundreds !== 13) {
        suffix = "rd";
    }

    return `${num}<sup>${suffix}</sup>`
}

// Main code
$(document).ready(() => {
    $.get("https://api.github.com/repos/PhotonicGluon/Abstract-Algebra-Book/releases", (releases) => {
        let latestRelease = releases[0];
        let assets = latestRelease["assets"];
        let body = latestRelease["body"];

        let asset = assets[0];
        let name = asset["name"];
        let downloadURL = asset["browser_download_url"];

        let nameMatch = name.match(
            /Abstract_Algebra_v(?<edition>[\d.]+)(?:-build\.(?<build>\d+))?(?:-post\.(?<post>\d+))?\.pdf/
        );
        let edition = nameMatch.groups["edition"];
        let build = nameMatch.groups["build"];
        let post = nameMatch.groups["post"];

        let downloadText = `Download ${ordinal_suffix(edition)} Edition`;
        if (build !== undefined) {
            downloadText += ` (Build ${build})`;
        }
        if (post !== undefined) {
            downloadText += ` (Post ${post})`;
        }

        $(`#book-download`).html(
            `<a href="${downloadURL}" class="button" download>${downloadText}</a>`
        );

        $("#latest-release").html(latestRelease["name"]);
        $("#changelog").html(converter.makeHtml(body));
        renderMathInElement(document.getElementById("changelog"), {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false },
                { left: "\\(", right: "\\)", display: false },
                { left: "\\[", right: "\\]", display: true }
            ],
            throwOnError: false
        });
    });
});