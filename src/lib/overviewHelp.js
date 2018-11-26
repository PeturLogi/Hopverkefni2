import {
  emptyElement, el, fetchJson, asText, asImage, isComplete,
} from './helpers';

function empty(element) {
  emptyElement(element);
}

function clicked(b) {
  return b.classList.contains('button--clicked');
}

function button(name) {
  return document.querySelector(`.button__${name}`);
}

function notFiltered(page) {
  const html = clicked(button('html'));
  const css = clicked(button('css'));
  const js = clicked(button('js'));
  const all = html && css && js;
  const none = !(html || css || js);
  if (all || none) {
    return true;
  }
  const type = page.category;
  if (type === 'html') {
    return html;
  }
  if (type === 'css') {
    return css;
  }
  if (type === 'javascript') {
    return js;
  }
  return false;
}

function createOverviewElements(pageData) {
  const itemsRow = el('div', 'items__row', null);
  pageData.forEach((page) => {
    if (notFiltered(page)) {
      const itemsCol = el('div', 'items__col', null);
      const item = el('div', 'item', null);
      const itemInfo = el('div', 'item__info', null);
      const itemText = el('div', 'item__text', null);
      const itemTitle = el('div', 'item__title', asText(page.title));
      const itemCategory = el('div', 'item__category', asText(page.category));
      const itemComplete = el('div', 'item__complete', null);
      if (isComplete(page.slug)) {
        itemComplete.classList.add('item__complete--true');
      } else {
        itemComplete.classList.add('item__complete--false');
      }
      const itemImage = el('div', 'item__image', asImage(page.thumbnail));
      itemText.appendChild(itemTitle);
      itemText.appendChild(itemCategory);
      itemInfo.appendChild(itemText);
      itemInfo.appendChild(itemComplete);
      item.appendChild(itemInfo);
      item.appendChild(itemImage);
      itemsCol.appendChild(item);
      itemsRow.appendChild(itemsCol);
      item.setAttribute('onclick', `location.href = './fyrirlestur.html?slug=${page.slug}';`);
    }
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
