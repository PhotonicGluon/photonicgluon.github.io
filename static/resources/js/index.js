// Configure colours for labels
$("#featured-projects-container").find("span").each((i, obj) => {
    $(obj).addClass(`featured-project-tag-${obj.innerText.toLowerCase()}`);
});
