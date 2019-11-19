window.addEventListener("load", () => {
    const loaderContainer = document.querySelector(".loader-container");
    const spinner = document.querySelector(".load-spinner");
    spinner.className += " site-loaded";
    loaderContainer.className += " site-loaded";
    const scroll = document.querySelector(".scroll-off");
    if (scroll) scroll.classList.remove("scroll-off");
    setTimeout(deleteSpinner, 2000); // let it fade, then delete it
});

function deleteSpinner() {
    const loaderContainer = document.querySelector(".loader-container");
    loaderContainer.parentNode.removeChild(loaderContainer);
}
