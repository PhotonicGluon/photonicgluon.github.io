/*
Possible tag colours:
- Red:      [229, 94, 81]
- Orange:   [205, 115, 58]
- Yellow:   [201, 155, 62]
- Green:    [100, 183, 93]
- Blue:     [107, 164, 248]
- Purple:   [156, 107, 223]
- Pink:     [204, 104, 160]
- Grey:     [141, 148, 157]
 */

// Constants
const PROJECTS_FOLDER = "/projects/";
const PROJECTS_FILE = PROJECTS_FOLDER + "projects.json";

const TAGS = {
    "programming": [100, 183, 93],
    "mathematics": [107, 164, 248],
    "music": [156, 107, 223],
    "writing": [205, 115, 58]
};

// Helper functions
function capitalize(string) {
    return string[0].toUpperCase() + string.substring(1);
}

function addAlphaToColour(colourArray, alpha) {
    return [colourArray[0], colourArray[1], colourArray[2], alpha];
}

function makeColourFromArray(colourArray) {
    if (colourArray.length === 3) {
        return `rgb(${colourArray[0]}, ${colourArray[1]}, ${colourArray[2]})`;
    } else {
        return `rgba(${colourArray[0]}, ${colourArray[1]}, ${colourArray[2]}, ${colourArray[3]})`;
    }
}

function addColourToTag(tagObj) {
    // Find the colour to add to the tag
    let tagType = tagObj.innerText.toLowerCase();
    let colourArray = TAGS[tagType];

    if (colourArray === null) {
        return;  // We already assigned default colours in CSS
    }

    // Specify colours
    $(tagObj).css("--tag-border-colour", makeColourFromArray(colourArray));
    $(tagObj).css("--tag-background-colour", makeColourFromArray(addAlphaToColour(colourArray, 0.5)));
}

function jekyllDateToString(jekyllDate) {
    return jekyllDate.split(" ")[0];
}

// Configure "back to top" button
let backToTopButton = $("#back-to-top");

$(window).scroll(() => {
    let scrollTop = $(window).scrollTop();
    if (scrollTop > $("#hero-box").height()) {
        // Show the button
        backToTopButton.css("visibility", "visible");
        backToTopButton.css("opacity", 1);
        backToTopButton.css("transform", "scale(1)");
    } else {
        // Hide the button
        backToTopButton.css("visibility", "hidden");
        backToTopButton.css("opacity", 0);
        backToTopButton.css("transform", "scale(0)");
    }
});

// Configure mobile navigation
let mainNav = $("#main-nav");
let mobileNavButtonOpen = $("#mobile-nav-button-open");
let mobileNavButtonClose = $("#mobile-nav-button-close");

mobileNavButtonOpen.click(() => {
    mainNav.css("width", "100%");
    $("html").css("overflow", "hidden");  // Disable scrolling when nav menu is open
});

mobileNavButtonClose.click(() => {
    mainNav.css("width", "0");
    $("html").css("overflow", "auto");
});