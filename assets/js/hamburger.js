(function () {
  var body = document.querySelector("body");
  var menuOpenTrigger = document.querySelector("#menu-trigger");
  var menuCloseTrigger = document.querySelector("#menu-close");
  var menuContainer = document.querySelector("#menu-container");
  var hamburgerIcon = document.querySelector(".hamburger");

  function toggleMenu() {
    if (menuContainer) {
      menuContainer.classList.toggle("hidden");
      menuContainer.classList.toggle("flex");
    }
    if (hamburgerIcon) {
      hamburgerIcon.classList.toggle("is-active");
    }
    if (body) {
      body.classList.toggle("lock-scroll");
    }
  }

  if (menuOpenTrigger) {
    menuOpenTrigger.addEventListener("click", toggleMenu);
  }
  if (menuCloseTrigger) {
    menuCloseTrigger.addEventListener("click", toggleMenu);
  }
})();
