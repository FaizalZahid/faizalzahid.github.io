document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll("nav ul li a");
    const sections = document.querySelectorAll("main section");

    function activateLink() {
        let index = sections.length;

        while(--index && window.scrollY + 50 < sections[index].offsetTop) {}

        links.forEach((link) => link.classList.remove("active"));
        links[index].classList.add("active");
    }

    activateLink();
    window.addEventListener("scroll", activateLink);

    links.forEach((link) => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: "smooth",
            });
        });
    });
});