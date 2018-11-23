function empty(element) {
  if (!element) {
    return;
  }
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function fetchJson() {
  return fetch('../lectures.json')
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Villa kom upp');
    });
}

function el(type, className, content) {
  const element = document.createElement(type);
  element.setAttribute('class', className);
  if (content) {
    element.appendChild(content);
  }
  return element;
}

function asText(text) {
  return document.createTextNode(text);
}

function asImage(imageURL) {
  const container = document.createElement('img');
  container.setAttribute('class', 'item__image');
  const imgURL = `../${imageURL}`;
  container.setAttribute('src', imgURL);
  return container;
}

function createPageElements(pageData) {
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
  });
  return itemsRow;
}

function fill(element) {
  fetchJson()
    .then((data) => {
      const list = data.lectures;
      element.appendChild(createPageElements(list));
    });
}

export { empty, fill };
