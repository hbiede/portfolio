$(window).on('load', function () {
    $('.level-bar-inner').each(function () {
        var itemWidth = $(this).data('level');

        $(this).animate({
            width: itemWidth
        }, 800);
    });
});

window.addEventListener("load", () => {
    const loaderContainer = document.querySelector(".loader-container");
    const spinner = document.querySelector(".load-spinner");
    spinner.className += " site-loaded";
    loaderContainer.className += " site-loaded";
    const scroll = document.querySelector(".scroll-off");
    scroll.classList.remove("scroll-off");
});

jQuery(document).ready(function ($) {


    /*======= Skillset *=======*/

    $('.level-bar-inner').css('width', '0');

    /* Bootstrap Tooltip for Skillset */
    $('.level-label').tooltip();

    /* Github Calendar - https://github.com/IonicaBizau/github-calendar */
    new GitHubCalendar("#github-graph", "HBiede");
});