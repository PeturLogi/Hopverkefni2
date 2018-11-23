import {
  emptyElement, el, fetchJson, asText, asImage,
} from './helpers';

function empty(element) {
  emptyElement(element);
}

function createOverviewElements(pageData) {
  const itemsRow = el('div', 'items__row', null);
  pageData.forEach((page) => {
    const itemsCol = el('div', 'items__col', null);
    const item = el('div', 'item', null);
    const itemTitle = el('div', 'item__title', asText(page.title));
    const itemCategory = el('div', 'item__category', asText(page.category));
    const itemImage = el('div', 'item__image', asImage(page.thumbnail));
    item.appendChild(itemTitle);
    item.appendChild(itemCategory);
    item.appendChild(itemImage);
    itemsCol.appendChild(item);
    itemsRow.appendChild(itemsCol);
    item.setAttribute('onclick', `location.href = './fyrirlestur.html?slug=${page.slug}';`);
  });
  return itemsRow;
}

function fill(element) {
  fetchJson()
    .then((data) => {
      const list = data.lectures;
      element.appendChild(createOverviewElements(list));
    });
}

export {
  empty,
  fill,
};
