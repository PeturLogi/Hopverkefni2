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
  }
});
