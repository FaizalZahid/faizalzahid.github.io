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

document.querySelectorAll('.toggle-button').forEach(button => {
  button.addEventListener('click', () => {
    const content = button.nextElementSibling;
    if (content.style.display === "none" || !content.style.display) {
      content.style.display = "block";
      button.classList.add('active');
    } else {
      content.style.display = "none";
      button.classList.remove('active');
    }
  });
});
