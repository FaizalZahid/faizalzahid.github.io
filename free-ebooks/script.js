document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("play").addEventListener("click", function() {
        var audio = document.getElementById("myAudio");
        audio.volume = 0.5;
        audio.play();
    });
    document.getElementById("toggle-checkbox-music").addEventListener("click", function() {
        var audio = document.getElementById("myAudio");
        audio.volume = 0.5;
        audio.play();
    });
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

    document.querySelectorAll('.toggle-button').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            if (content.style.display === "none" || !content.style.display) {
                content.style.display = "block";
            } else {
                content.style.display = "none";
            }
        });
    });
});

//////////////////////////////////
//Popular Books Related Functions:

const cards = document.querySelectorAll('.card');

function activateCard(index) {
    resetCards();
    cards[index].classList.add('active');
    setZIndex(index + 1);
}

function resetCards() {
    cards.forEach(card => {
        card.classList.remove('active');
    });
}

function setZIndex(hoveredIndex) {
    const maxZIndex = 5;

    cards.forEach((card, index) => {
        if (index === hoveredIndex - 1) {
            card.style.zIndex = maxZIndex;
        } else if (index < hoveredIndex - 1) {
            card.style.zIndex = maxZIndex - 1 - (hoveredIndex - 1 - index);
        } else if (index > hoveredIndex - 1) {
            card.style.zIndex = maxZIndex - (index - hoveredIndex + 1);
        }
    });
}

cards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        resetCards();
        card.classList.add('active');
        setZIndex(index + 1);
    });
});

activateCard(2);