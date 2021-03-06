let frameData = [];

var dataHandling = (function (window, document, undefined) {
  'use strict';

  const searchInput = document.querySelector('.search');
  const results = document.querySelector('.results');
  const characterSelect = document.getElementById('characters');
  const movesCount = document.querySelector('.count');
  const moveFilters = document.querySelectorAll('.move-filter');

  // Fetches character's frame data and uses it to create array frameData
  function dataFetch(character) {
    frameData = [];
    const regChar = character.toLowerCase().replace(/ /g, '_');
    fetch(`assets/data/${regChar}.json`)
      .then(blob => blob.json())
      .then(data => frameData.push(...data))
      .then(displayData);
  }

  function changeCharacter() {
    dataFetch(this.value);
  }

  function countMoves() {
    // return results.childElementCount;
    return results.querySelectorAll('.command').length;
  }

  function updateCount() {
    movesCount.textContent = `Showing ${countMoves()} moves`;
  }

  function emptySearch() {
    searchInput.value = '';
  }

	function sortData(data) {
		const ordered = data.sort((a, b) => a.damage > b.damage ? 1 : -1);

	}



  function renderDataList(data) {
    const html = data.map(move => {
      const splitCommand = move.command.split(',').map(s => s.replace(/\(([^)]+)\)/g, '').replace(/[|&/;$%@"<>()+, ]/g, '').replace(/~/, 'tilde'));
      const splitDamage = move.damage.split(',').join(', ');

      splitCommand.map(function(part, index, arr) {
        return arr[index] = `
          <svg class="button${arr[index]}">
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="assets/images/sprites.buttons.svg#button${arr[index]}">
            </use>
          </svg>
        `;
      });

      return `
        <tr>
          <td class="command">${move.command}</td>
          <td class="orientation">${move.orientation}</td>
          <td class="damage">${splitDamage}</td>
          <td class="frames">${move.frames}</td>
          <td class="block">${move.block}</td>
          <td class="hit">${move.hit}</td>
          <td class="ch">${move.ch}</td>
        </tr>
        <tr>
          <td colspan="7">${splitCommand.join('')}</td>
        </tr>
      `;
    }).join('');
    results.innerHTML = html;
    updateCount();
  }

  function displayData() {
    renderDataList(frameData);
  }

  function findMatches(wordToMatch, frameData) {
    return frameData.filter(move => {
      const regex = new RegExp(wordToMatch, 'gi');
      return move.command.match(regex);
    })
  }

  function displayMatches() {
    const matchArray = findMatches(this.value, frameData);
    // const html = matchArray.map(move => {
    //   const regex = new RegExp(this.value, 'gi');
    //   const searchHighlight = move.command.replace(regex, `<span class="highlight">${this.value}</span>`);
    //   return `
    //     <tr>
    //       <td class="command">${searchHighlight}</td>
    //       <td class="orientation">${move.orientation}</td>
    //       <td class="damage">${move.damage}</td>
    //       <td class="frames">${move.frames}</td>
    //       <td class="block">${move.block}</td>
    //       <td class="hit">${move.hit}</td>
    //       <td class="ch">${move.ch}</td>
    //     </tr>
    //   `;
    // }).join('');
    // results.innerHTML = html;
    renderDataList(matchArray);
  }

function filterByMoveTypes() {
  let activeMoveTypes = [];

  moveFilters.forEach(m => {
    if (m.checked) {
      activeMoveTypes.push(m.value);
    }
  });

  if (activeMoveTypes.length < 1) {
    return renderDataList(frameData);

  }

  const filteredFrames = frameData.filter(fd => {
    for (const move of activeMoveTypes) {
      if (fd[move]) return true;
    }
    return false;
  });

  renderDataList(filteredFrames);
}

  searchInput.addEventListener('change', displayMatches);
  searchInput.addEventListener('keyup', displayMatches);

  characterSelect.addEventListener('change', changeCharacter);
  characterSelect.addEventListener('change', emptySearch);

  moveFilters.forEach(prop => prop.addEventListener('change', emptySearch));
  moveFilters.forEach(prop => prop.addEventListener('change', filterByMoveTypes));


  return {
    dataFetch: dataFetch,
		sortData: sortData
  };

})(window, document);
