var dataHandling = (function (window, document, undefined) {
  'use strict';

  let frameData = [];

  const searchInput = document.querySelector('.search');
  const results = document.querySelector('.results');
  const characterSelect = document.getElementById('characters');
  const movesCount = document.querySelector('.count');

  // function init() {
  //   // dataFetch(characters[0]);
  // }

  function dataFetch(character) {
    frameData = [];
    fetch(`/assets/data/${character}.json`)
      .then(blob => blob.json())
      .then(data => frameData.push(...data))
      .then(displayData);
  }

  function changeCharacter() {
    dataFetch(this.value);
  }

  function countMoves() {
    return frameData.length;
  }

  function updateCount() {
    movesCount.textContent = `${countMoves()} moves`;
  }

  function displayData() {
    const html = frameData.map(move => {
      return `
        <tr>
          <td class="command">${move.command}</td>
          <td class="orientation">${move.orientation}</td>
          <td class="damage">${move.damage}</td>
          <td class="frames">${move.frames}</td>
          <td class="block">${move.block}</td>
          <td class="hit">${move.hit}</td>
          <td class="ch">${move.ch}</td>
        </tr>
      `;
    }).join('');
    results.innerHTML = html;
    updateCount();
  }

  function findMatches(wordToMatch, frameData) {
    return frameData.filter(move => {
      const regex = new RegExp(wordToMatch, 'gi');
      return move.command.match(regex);
    })
  }

  function displayMatches() {
    const matchArray = findMatches(this.value, frameData);
    const html = matchArray.map(move => {
      return `
        <tr>
          <td class="command">${move.command}</td>
          <td class="orientation">${move.orientation}</td>
          <td class="damage">${move.damage}</td>
          <td class="frames">${move.frames}</td>
          <td class="block">${move.block}</td>
          <td class="hit">${move.hit}</td>
          <td class="ch">${move.ch}</td>
        </tr>
      `;
    }).join('');
    results.innerHTML = html;
    updateCount();
  }

  searchInput.addEventListener('change', displayMatches);
  searchInput.addEventListener('keyup', displayMatches);
  characterSelect.addEventListener('change', changeCharacter);

  return {
    // init: init,
    dataFetch: dataFetch
  };

})(window, document);

// dataHandling.init();
