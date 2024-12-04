const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');

function backdropClickHandler() {
  // @ts-ignore
  backdrop.style.display = 'none';
  // @ts-ignore
  sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
  // @ts-ignore
  backdrop.style.display = 'block';
  // @ts-ignore
  sideDrawer.classList.add('open');
}

// @ts-ignore
backdrop.addEventListener('click', backdropClickHandler);
// @ts-ignore
menuToggle.addEventListener('click', menuToggleClickHandler);
