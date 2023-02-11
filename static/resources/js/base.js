// Constants
const PROJECTS_FOLDER = "/projects/";
const TAGS = {
    "programming": [13, 114, 165],
    "mathematics": [82, 122, 82],
    "music": [184, 184, 20]
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
