import { empty, fillLecture } from './lectureHelper';

export default class Lecture {
  constructor() {
    this.container = document.querySelector('.lecture__col');
  }

  load() {
    empty(this.container);
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('slug');
    fillLecture(myParam);
  }
}
