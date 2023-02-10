// Helper functions
function capitalize(string) {
    return string[0].toUpperCase() + string.substring(1);
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
