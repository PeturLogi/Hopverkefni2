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
  // src='<URL>' frameborder='0' allowfullscreen='0'
  const element = el(elType, classAttribute, null);
  element.setAttribute('src', object.data);
  element.setAttribute('allowfullscreen', '0');
  element.setAttribute('frameborder', '0');
  const container = el('div', 'content__video', element);
  return container;
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
  const elType = 'div';
  const classAttribute = 'content__quote';
  const contentText = object.data;
  const contentAttribute = object.attribute;
  const container = el(elType, classAttribute, null);
  const text = el(elType, 'quote__text', asText(contentText));
  const attribute = el(elType, 'quote__attribute', asText(contentAttribute));
  container.appendChild(text);
  container.appendChild(attribute);
  return container;
}
// Skilar html elementi fyrir type = image
function imageContent(object) {
  const classAttribute = 'content__image';
  const imgLink = object.data;
  const imgCaption = object.caption;
  const container = el('div', classAttribute, null)
  const img = el('img', 'image__img content__img', null);
  const protection = el('div', 'image__protection', null);
  const caption = el('p', 'image__caption', asText(imgCaption));
  container.appendChild(img);
  container.appendChild(protection);
  container.appendChild(caption);
  img.setAttribute('src', imgLink);


  return container;
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
    const itemElement = el('li', 'content__li', asText(listItem));
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

function updateFinishButton(lectureName) {
  console.log(`Current ástand takka: ${window.localStorage.getItem(lectureName)}`);
  const buttonKlara = document.querySelector('.button__klara');
  if (window.localStorage.getItem(lectureName) === 'true') {
    buttonKlara.removeChild(buttonKlara.childNodes[0]);
    buttonKlara.appendChild(asText('✓ Fyrirlestur kláraður'));
  } else {
    buttonKlara.removeChild(buttonKlara.childNodes[0]);
    buttonKlara.appendChild(asText('Klára fyrirlestur'));
  }
}


// Fall sem keyrir ef smellt er á "klára fyrirlestur"
function finishLecture(e) {
  const lectureName = getCurrentLectureSlug();
  if (window.localStorage.getItem(lectureName) === 'true') {
    window.localStorage.setItem(lectureName, 'false');
    updateFinishButton(lectureName);
  } else {
    window.localStorage.setItem(lectureName, 'true');
    updateFinishButton(lectureName);
  }
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

// FEsta listener á finish button
function connectButtons() {
  const finishButton = document.querySelector('.button__klara');
  finishButton.addEventListener('click', finishLecture);
}

// Setur inn upplýsingar fyrir title og category í hausinn á fyrirlestri
function updateHeader(lectureData) {
  const titleContainer = document.querySelector('.header__title');
  const categoryContainer = document.querySelector('.header__category');
  titleContainer.appendChild(asText(lectureData.title));
  categoryContainer.appendChild(asText(lectureData.category));
}

// Fær inn json hlut með upplýsingar um fyrirlestur
// býr til lecture elementin
function createLectureElements(lecture) {
  const lectureData = lecture.content;
  const container = document.querySelector('.lecture');
  lectureData.forEach((dataObj) => {
    const contents = elementType(dataObj);
    if (contents) {
      container.appendChild(contents);
    }
  });
  updateHeader(lecture);
  connectButtons();
  updateFinishButton(lecture.slug);
}

// Sækir json gögn fyrir tiltekinn fyrirlestur og bíður þar til
// þau eru tilbúin til að kalla á viðeigandi smiði
function fillLecture(lectureName) {
  fetchJson().then((data) => {
    const list = data.lectures;
    const lecture = findLecture(lectureName, list);
    return lecture;
  }).then((lecture) => {
    createLectureElements(lecture);
  });
}


export {
  empty,
  fillLecture,
};
