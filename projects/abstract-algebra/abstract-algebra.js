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
        let numAssets = assets.length;
        let body = latestRelease["body"];

        for (let i = 0; i < numAssets; i++) {
            let asset = assets[i];

            let name = asset["name"];
            let downloadURL = asset["browser_download_url"];

            let nameMatch = name.match(/Volume(?<volNum>\d)_v(?<volVer>[\d.]+)\.pdf/);
            let volumeNumber = nameMatch.groups["volNum"];
            let volumeNumberRoman = romanNumeral(volumeNumber);
            let volumeVersion = nameMatch.groups["volVer"];

            let version = volumeNumberRoman + "." + volumeVersion;

            $(`#volume-${volumeNumber}`).html(
                `<a href="${downloadURL}" class="button" download>Download Version ${version}</a>`
            );
        }

        $("#latest-release").html(`(${latestRelease["name"]})`);
        $("#changelog").html(converter.makeHtml(body));
        renderMathInElement(document.getElementById("changelog"), {
            // customised options
            // • auto-render specific keys, e.g.:
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false},
                {left: "\\(", right: "\\)", display: false},
                {left: "\\[", right: "\\]", display: true}
            ],
            // • rendering keys, e.g.:
            throwOnError : false
        });
    });
});