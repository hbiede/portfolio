window.addEventListener("load", () => {
    const loaderContainer = document.querySelector(".loader-container");
    const spinner = document.querySelector(".load-spinner");
    spinner.className += " site-loaded";
    loaderContainer.className += " site-loaded";
    const scroll = document.querySelector(".scroll-off");
    if (scroll) scroll.classList.remove("scroll-off");
});