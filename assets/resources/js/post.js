// Update hero box tags
$("#hero-box-content").html(`
    <h1 id="hero-box-post-name">${$("#post-name").html()}</h1>
    <h2 id="hero-box-post-date">${jekyllDateToString($("#post-date").html())}</h2>
`);
