function emptyElement(element) {
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
  if (imageURL) {
    const container = document.createElement('img');
    container.setAttribute('class', 'item__image');
    const imgURL = `../${imageURL}`;
    container.setAttribute('src', imgURL);
    return container;
  }
  return null;
}

export {
  emptyElement,
  el,
  fetchJson,
  asText,
  asImage,
};
