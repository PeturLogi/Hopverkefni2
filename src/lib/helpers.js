// Tæmir öll child elements í gefnu elementi
function emptyElement(element) {
  if (!element) {
    return;
  }
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Athugar hvort tiltekinn fyrirlestur sé merktur sem complete í local storage
// skilar true ef merkt complete, false ef ekkert merkt eða merkt false
function isComplete(slug) {
  return (window.localStorage.getItem(slug) === 'true');
}

// Skilar fyrirlestraupplýsingum á json formi
function fetchJson() {
  return fetch('lectures.json')
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Villa kom upp');
    });
}

// Skilar elementi af týpu type, með class attribute className og inniheldur content
function el(type, className, content) {
  const element = document.createElement(type);
  element.setAttribute('class', className);
  if (content) {
    element.appendChild(content);
  }
  return element;
}

// breytir streng í textNode sem setja má í element
function asText(text) {
  return document.createTextNode(text);
}

// Skilar img elementi með tilheyrandi class attributes
function asImage(imageURL) {
  if (imageURL) {
    const container = document.createElement('img');
    container.setAttribute('class', 'item__image');
    const imgURL = `${imageURL}`;
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
  isComplete,
};
