import { empty } from './helpers';
const JSON_DATA = './lectures.json';

export default class List {
  constructor() {
    this.container = document.querySelector('.list');
  }

  load() {
    empty(this.container);
  }


}
