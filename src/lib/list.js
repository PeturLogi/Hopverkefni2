import { empty, fill } from './helpers';

export default class List {
  constructor(page) {
    this.container = page
  }

  load() {
    empty(this.container);
    fill(this.container);
  }
}
