const backdrop = document.querySelector(".backdrop");

function backdropClickHandler() {
  backdrop.style.display = "none";
}

function menuToggleClickHandler() {
  backdrop.style.display = "block";
}

backdrop.addEventListener("click", backdropClickHandler);
