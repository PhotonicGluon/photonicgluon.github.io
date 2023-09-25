// Initialize Showdown converter
let converter = new showdown.Converter();

// Helper functions
function romanNumeral(number) {  // https://stackoverflow.com/a/9083076
    // Constants
    const key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
        "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
        "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

    if (number === "0") return "0";

    let digits = String(+number).split(""), roman = "", i = 3;
    while (i--) roman = (key[+digits.pop() + (i * 10)] || "") + roman;

    return Array(+digits.join("") + 1).join("M") + roman;
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

        let nameMatch = name.match(/Abstract_Algebra-v(?<version>[\d.]+)\.pdf/);
        let version = nameMatch.groups["version"];

        $(`#book-download`).html(
            `<a href="${downloadURL}" class="button" download>Download Version ${version}</a>`
        );

        $("#latest-release").html(`(${latestRelease["name"]})`);
        $("#changelog").html(converter.makeHtml(body));
        renderMathInElement(document.getElementById("changelog"), {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false},
                {left: "\\(", right: "\\)", display: false},
                {left: "\\[", right: "\\]", display: true}
            ],
            throwOnError: false
        });
    });
});