import { empty, fill } from './overviewHelp';

export default class Overview {
  constructor() {
    this.container = document.querySelector('.items');
  }

  load() {
    empty(this.container);
    fill(this.container);
  }
}
