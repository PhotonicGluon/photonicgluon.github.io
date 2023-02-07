let backToTopButton = $("#back-to-top");

$(window).scroll(() => {
    let scrollTop = $(window).scrollTop();
    if (scrollTop > $("#featured-projects").position().top) {
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