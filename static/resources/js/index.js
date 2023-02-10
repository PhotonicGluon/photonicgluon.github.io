// Configure "back to top" button
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

// Configure colours for labels
$("#featured-projects-container").find("span").each((i, obj) => {
    $(obj).addClass(`featured-project-tag-${obj.innerText.toLowerCase()}`);
});
