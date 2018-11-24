import Overview from './lib/overview';
import Lecture from './lib/lecture';

document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('body');
  const isLecturePage = page.classList.contains('lecture-page');
  if (isLecturePage) {
    const lecture = new Lecture();
    lecture.load();
  } else {
    const overview = new Overview();
    overview.load();
    initOverViewButtons();
  }
});

function initOverViewButtons() {
  const buttonHtml = document.querySelector('.button__html');
  const buttonCss = document.querySelector('.button__css');
  const buttonJS = document.querySelector('.button__js');
  buttonHtml.addEventListener('click', clickhandler);
  buttonCss.addEventListener('click', clickhandler);
  buttonJS.addEventListener('click', clickhandler);
}

function clickhandler(e) {
  const button = e.target;
  console.log(`Button pressed: ${button}`);
  if(button.classList.contains('button--clicked')) {
    button.classList.remove('button--clicked')
  }
  else {
    button.classList.add('button--clicked');
  }
  const overview = new Overview();
  overview.load();
}
