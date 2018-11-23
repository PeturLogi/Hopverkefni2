import { empty, fill } from './helpers';

export default class List {
  constructor() {
    this.container = document.querySelector('.items');
  }

  load() {
    empty(this.container);
    fill(this.container);
  }
}
