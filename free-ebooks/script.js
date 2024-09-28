document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("jupiter-play").addEventListener("click", function() {
        var jupiterAudio = document.getElementById("myAudio");
        jupiterAudio.volume = 0.5;
        jupiterAudio.play();
    });
    document.getElementById("toggle-checkbox-music").addEventListener("click", function() {
        var jupiterAudio = document.getElementById("myAudio");
        jupiterAudio.volume = 0.5;
        jupiterAudio.play();
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

    const audio = document.getElementById("audio");
    const play = document.getElementById("play");
    const pause = document.getElementById("pause");
    const loading = document.getElementById("loading");
    const bar = document.getElementById("bar");
    const thumb = document.getElementById("thumb");
    const progress = document.getElementById("progress");
    const timeDisplay = document.getElementById("time-display");

    function formatTime(seconds) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      return [h, m, s].map(v => v < 10 ? "0" + v : v).join(":");
    }

    function updateTimeDisplay() {
      const currentTime = formatTime(audio.currentTime);
      const duration = formatTime(audio.duration);
      timeDisplay.textContent = `${currentTime}/${duration}`;
    }

    function displayControls() {
      loading.style.display = "none";
      play.style.display = "block";
      updateTimeDisplay();
    }

    function updateProgress(position) {
      const percentage = (position / progress.offsetWidth) * 100;
      bar.style.width = `${percentage}%`;
      thumb.style.left = `${percentage}%`;
      audio.currentTime = (percentage / 100) * audio.duration;
    }

    if (audio.readyState >= 2) {
      displayControls();
    } else {
      audio.addEventListener("loadedmetadata", () => {
        displayControls();
      });
    }

    play.addEventListener("click", () => {
      audio.play();
      play.style.display = "none";
      pause.style.display = "block";
    });

    pause.addEventListener("click", () => {
      audio.pause();
      pause.style.display = "none";
      play.style.display = "block";
    });

    audio.addEventListener("timeupdate", () => {
      const percentage = (audio.currentTime / audio.duration) * 100;
      bar.style.width = `${percentage}%`;
      thumb.style.left = `${percentage}%`;
      updateTimeDisplay();
    });

    let isDragging = false;

    function handleInteraction(e) {
      const rect = progress.getBoundingClientRect();
      const position = (e.clientX || e.touches[0].clientX) - rect.left;
      updateProgress(position);
    }

    progress.addEventListener("mousedown", (e) => {
      isDragging = true;
      handleInteraction(e);
    });

    progress.addEventListener("touchstart", (e) => {
      isDragging = true;
      handleInteraction(e);
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        handleInteraction(e);
      }
    });

    document.addEventListener("touchmove", (e) => {
      if (isDragging) {
        handleInteraction(e);
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    document.addEventListener("touchend", () => {
      isDragging = false;
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