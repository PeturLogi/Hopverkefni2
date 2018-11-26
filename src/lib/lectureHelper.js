import {
  el,
  emptyElement,
  fetchJson,
  asText,
  isComplete,
} from './helpers';

function empty(element) {
  emptyElement(element);
}

function findLecture(value, list) {
  let correctLecture = null;
  list.forEach((lecture) => {
    if (lecture.slug === value) {
      correctLecture = lecture;
    }
  });
  return correctLecture;
}


// Skilar html elementi fyrir type = youtube
function youtubeContent(object) {
  const elType = 'iframe';
  const classAttribute = 'content__youtube';
  // src="<URL>" frameborder="0" allowfullscreen="0"
  const element = el(elType, classAttribute, null);
  element.setAttribute('src', object.data);
  element.setAttribute('allowfullscreen', '0');
  element.setAttribute('frameborder', '0');
  return element;
}
// Skilar html elementi fyrir type = text
function textContent(object) {
  const elType = 'p';
  const classAttribute = 'content__text';
  const container = document.querySelector('.lecture');
  const rawString = object.data;
  const stringArray = rawString.split('\n');
  stringArray.forEach((tempString) => {
    const text = document.createTextNode(tempString);
    const ptext = el(elType, classAttribute, text);
    container.appendChild(ptext);
  });
  return null;
}
// Skilar html elementi fyrir type = quote
function quoteContent(object) {
  const elType = 'p';
  const classAttribute = 'content__quote';
  const content = object.data;
  const element = el(elType, classAttribute, asText(content));
  return element;
}
// Skilar html elementi fyrir type = image
function imageContent(object) {
  const elType = 'img';
  const classAttribute = 'content__image';
  const content = object.data;
  const element = el(elType, classAttribute, null);
  element.setAttribute('src', content);
  return element;
}
// Skilar html elementi fyrir type = heading
function headingContent(object) {
  const elType = 'p';
  const classAttribute = 'content__heading';
  const content = object.data;
  const element = el(elType, classAttribute, asText(content));
  return element;
}
// Skilar html elementi fyrir type = list
function listContent(object) {
  const elType = 'ul';
  const classAttribute = 'content__list';
  const content = object.data;
  const element = el(elType, classAttribute, null);
  content.forEach((listItem) => {
    const itemElement = el('li', 'List__text', asText(listItem));
    element.appendChild(itemElement);
  });
  return element;
}
// Skilar html elementi fyrir type = code
function codeContent(object) {
  const elType = 'p';
  const classAttribute = 'content__code';
  const content = object.data;
  const element = el(elType, classAttribute, asText(content));
  return element;
}

// Fall sem skilar slug nýverandi fyrirlesturs
function getCurrentLectureSlug() {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.get('slug');
  return urlParams.get('slug');
}

// Fall sem keyrir ef smellt er á "klára fyrirlestur"
function finishLecture(e) {
  const lectureName = getCurrentLectureSlug();
  window.localStorage.setItem(lectureName, 'true');
  e.target.removeChild(e.target.childNodes[0]);
  e.target.appendChild(asText('✓ Fyrirlestur kláraður'));
}

// fall sem skilar button sem sendir notanda aftur á forsíðu
function returnButton() {
  const element = el('button', 'content__return', asText('Til baka'));
  element.setAttribute('href', '../');
  return element;
}

// skilar html element af takka sem keyrir finishLecture ef hann er ekki búinn
function finishLectureButton() {
  const element = el('button', 'content__return', null);
  if (isComplete(getCurrentLectureSlug())) {
    element.appendChild(asText('✓ Fyrirlestur kláraður'));
  } else {
    element.appendChild(asText('Klára fyrirlestur'));
  }
  element.addEventListener('click', finishLecture);
  return element;
}

// Fall sem skilar réttu html elementi fyrir gefinn object úr json fileinu
function elementType(dataObj) {
  const youtube = {
    type: 'youtube',
    contentMethod: () => youtubeContent(dataObj),
  };
  const text = {
    type: 'text',
    contentMethod: () => textContent(dataObj),
  };
  const quote = {
    type: 'quote',
    contentMethod: () => quoteContent(dataObj),
  };
  const image = {
    type: 'image',
    contentMethod: () => imageContent(dataObj),
  };
  const heading = {
    type: 'heading',
    contentMethod: () => headingContent(dataObj),
  };
  const list = {
    type: 'list',
    contentMethod: () => listContent(dataObj),
  };
  const code = {
    type: 'code',
    contentMethod: () => codeContent(dataObj),
  };

  const typeArray = [youtube, text, quote, image, heading, list, code];
  let returnElement = null;
  typeArray.forEach((elObj) => {
    if (elObj.type === dataObj.type) {
      returnElement = elObj.contentMethod();
    }
  });
  return returnElement;
}

// Fær inn json hlut með upplýsingar um fyrirlestur
// býr til lecture elementin
function createLectureElements(lectureData) {
  const container = document.querySelector('.lecture');
  lectureData.forEach((dataObj) => {
    const contents = elementType(dataObj);
    if (contents) {
      container.appendChild(contents);
    }
  });
  container.appendChild(finishLectureButton());
  container.appendChild(returnButton());
}

function fillLecture(lectureName) {
  fetchJson().then((data) => {
    const list = data.lectures;
    const lecture = findLecture(lectureName, list);
    return lecture;
  }).then((lecture) => {
    createLectureElements(lecture.content);
  });
}


export {
  empty,
  fillLecture,
};
