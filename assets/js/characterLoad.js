var characterLoad = (function (window, document, undefined) {
  'use strict';

  const characters = [];

  const charactersList = document.getElementById('characters');

  function init() {
    dataFetch();
  }

  function dataFetch() {
    fetch(`assets/data/characters.json`)
      .then(blob => blob.json())
      .then(data => characters.push(...data))
      .then(appendList)
      .then(() => dataHandling.dataFetch(characters[0]))
  }

  function appendList() {
    const html = characters.map(character => {
      return `<option value="${character}">${character}</option>`;
    }).join('');
    charactersList.innerHTML = html;
  }

  return {
    init: init,
    dataFetch: dataFetch
  }

})(window, document);

characterLoad.init();
