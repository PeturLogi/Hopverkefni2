import { el, emptyElement, fetchJson, asText } from './helpers';

function empty(element) {
  emptyElement(element);
}
function findLecture(value, list) {
  let correctLecture = null;
  list.forEach((lecture) => {
    if (lecture.slug === value)  {
      correctLecture = lecture;
    }
  });
  return correctLecture;
}

export { empty, fillLecture };

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
    const itemElement = el('li', 'List__text', asText(listItem));
    element.appendChild(itemElement);
  })
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

// Fall sem skilar réttu html elementi fyrir gefinn object úr json fileinu
function elType(dataObj) {
  const youtube = {
    type: 'youtube',
    contentMethod: (elemType, classAtt) => {
      return youtubeContent(dataObj);
    }
  };
  const text = {
    type: 'text',
    contentMethod: (elemType, classAtt) => {
      return textContent(dataObj);
    }
  };
  const quote = {
    type: 'quote',
    contentMethod: (elemType, classAtt) => {
      return quoteContent(dataObj);
    }
  };
  const image = {
    type: 'image',
    contentMethod: (elemType, classAtt) => {
      return imageContent(dataObj);
    }
  };
  const heading = {
    type: 'heading',
    contentMethod: (elemType, classAtt) => {
      return headingContent(dataObj);
    }
  };
  const list = {
    type: 'list',
    contentMethod: (elemType, classAtt) => {
      return listContent(dataObj);
    }
  };
  const code = {
    type: 'code',
    contentMethod: (elemType, classAtt) => {
      return codeContent(dataObj);
    }
  };

  const typeArray = [youtube, text, quote, image, heading, list, code];
  let returnElement = null;
  typeArray.forEach((elObj) => {
    if(elObj.type == dataObj.type) {
      returnElement = elObj.contentMethod(elObj.elType, elObj.classAttribute);
    }
  });
  return returnElement;
}

function createLectureElements(lectureData) {
  const container = document.querySelector('.lecture');
  lectureData.forEach((dataObj) => {
    const contents = elType(dataObj);
    if (contents) {
      container.appendChild(contents);
    }
  });
}

function fillLecture (lectureName) {
  fetchJson().then((data) => {
    const list = data.lectures;
    const lecture = findLecture(lectureName, list);
    return lecture;
  }).then((lecture) => {
    createLectureElements(lecture.content);
  });
}
