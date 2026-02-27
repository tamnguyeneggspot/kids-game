(function () {
  'use strict';

  var S = window.alphabetShared;
  if (!S) return;

  var LETTERS = S.LETTERS;
  var questionText = S.questionText;
  var letterDisplayWrap = S.letterDisplayWrap;
  var choicesEl = S.choicesEl;
  var feedbackEl = S.feedbackEl;
  var btnNext = S.btnNext;
  var shuffle = S.shuffle;
  var randomInt = S.randomInt;
  var addScore = S.addScore;
  var showCelebration = S.showCelebration;
  var showWrongEffect = S.showWrongEffect;
  var removeCelebration = S.removeCelebration;
  var removeWrongEffect = S.removeWrongEffect;
  var speak = S.speak;

  var sortPanel = document.getElementById('sortPanel');
  var sortInstruction = document.getElementById('sortInstruction');
  var sortSlotsEl = document.getElementById('sortSlots');
  var sortPoolEl = document.getElementById('sortLettersPool');
  var sortFeedbackEl = document.getElementById('sortFeedback');
  var sortBtnNext = document.getElementById('sortBtnNext');

  var SORT_COUNT = 3;
  var correctOrder = [];
  var slotLetters = [];
  var poolLetters = [];
  var answered = false;
  var dragSource = null;
  var dragLetter = null;

  function createLetterSpan(letter, fromPool) {
    var span = document.createElement('span');
    span.className = 'sort-letter' + (fromPool ? ' sort-letter-pool' : '');
    span.textContent = letter;
    span.setAttribute('draggable', 'true');
    span.setAttribute('data-letter', letter);
    span.setAttribute('aria-label', 'Chữ ' + letter);
    span.addEventListener('dragstart', onDragStart);
    span.addEventListener('dragend', onDragEnd);
    return span;
  }

  function onDragStart(ev) {
    if (answered) return;
    var el = ev.target;
    if (!el.classList.contains('sort-letter')) return;
    dragLetter = el.getAttribute('data-letter');
    dragSource = el.closest('.sort-letters-pool') ? 'pool' : el.closest('.sort-slot');
    if (dragSource && dragSource !== 'pool') dragSource = dragSource.getAttribute('data-slot-index');
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData('text/plain', dragLetter);
    ev.dataTransfer.setData('application/sort-source', dragSource === 'pool' ? 'pool' : 'slot-' + dragSource);
    el.classList.add('sort-dragging');
  }

  function onDragEnd(ev) {
    ev.target.classList.remove('sort-dragging');
    dragSource = null;
    dragLetter = null;
  }

  function onSlotDragOver(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
    var slot = ev.target.closest('.sort-slot');
    if (slot) slot.classList.add('sort-slot-over');
  }

  function onSlotDragLeave(ev) {
    var slot = ev.target.closest('.sort-slot');
    if (slot) slot.classList.remove('sort-slot-over');
  }

  function onSlotDrop(ev) {
    ev.preventDefault();
    var slot = ev.target.closest('.sort-slot');
    if (!slot) return;
    slot.classList.remove('sort-slot-over');
    var letter = ev.dataTransfer.getData('text/plain');
    if (!letter) return;
    var src = ev.dataTransfer.getData('application/sort-source');
    var slotIdx = parseInt(slot.getAttribute('data-slot-index'), 10);

    if (src === 'pool') {
      var poolSpan = sortPoolEl.querySelector('[data-letter="' + letter + '"]');
      if (poolSpan) poolSpan.remove();
      slotLetters[slotIdx] = letter;
      slot.innerHTML = '';
      slot.appendChild(createLetterSpan(letter, false));
      poolLetters = poolLetters.filter(function (l) { return l !== letter; });
    } else {
      var srcIdx = parseInt(src.replace('slot-', ''), 10);
      if (srcIdx === slotIdx) return;
      var existing = slotLetters[slotIdx];
      var fromSlot = sortSlotsEl.querySelector('[data-slot-index="' + srcIdx + '"]');
      if (fromSlot) {
        slotLetters[srcIdx] = existing;
        fromSlot.innerHTML = '';
        if (existing) fromSlot.appendChild(createLetterSpan(existing, false));
        slotLetters[slotIdx] = letter;
        slot.innerHTML = '';
        slot.appendChild(createLetterSpan(letter, false));
      }
    }
    checkComplete();
  }

  function onPoolDragOver(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
  }

  function onPoolDrop(ev) {
    ev.preventDefault();
    var letter = ev.dataTransfer.getData('text/plain');
    if (!letter) return;
    var src = ev.dataTransfer.getData('application/sort-source');
    if (src === 'pool') return;
    var srcIdx = parseInt(src.replace('slot-', ''), 10);
    var fromSlot = sortSlotsEl.querySelector('[data-slot-index="' + srcIdx + '"]');
    if (fromSlot) {
      fromSlot.innerHTML = '';
      slotLetters[srcIdx] = null;
      poolLetters.push(letter);
      var span = createLetterSpan(letter, true);
      sortPoolEl.appendChild(span);
    }
  }

  function checkComplete() {
    var filled = 0;
    for (var i = 0; i < slotLetters.length; i++) {
      if (slotLetters[i]) filled++;
    }
    if (filled < correctOrder.length) return;

    var ordered = slotLetters.slice(0, correctOrder.length).join('');
    var expected = correctOrder.join('');
    if (ordered !== expected) return;

    answered = true;
    addScore();
    sortFeedbackEl.textContent = 'Đúng rồi! 🎉';
    sortFeedbackEl.className = 'feedback success sort-feedback';
    sortFeedbackEl.hidden = false;
    if (window.webGameSfx) window.webGameSfx.playCorrect();
    speak('Đúng rồi! Thứ tự đúng là ' + correctOrder.join(', ') + '.', 'vi-VN');
    showCelebration();
    sortBtnNext.hidden = false;
    sortBtnNext.focus();

    var slots = sortSlotsEl.querySelectorAll('.sort-slot');
    slots.forEach(function (s) { s.classList.add('sort-slot-correct'); });
  }

  function showSortGame() {
    answered = false;
    removeCelebration();
    removeWrongEffect();
    sortFeedbackEl.hidden = true;
    sortBtnNext.hidden = true;

    var maxStart = Math.max(0, LETTERS.length - SORT_COUNT);
    var start = randomInt(0, maxStart);
    correctOrder = LETTERS.slice(start, start + SORT_COUNT);
    var shuffled = shuffle(correctOrder.slice());
    slotLetters = correctOrder.map(function () { return null; });
    poolLetters = shuffled.slice();

    sortSlotsEl.innerHTML = '';
    for (var i = 0; i < correctOrder.length; i++) {
      var slot = document.createElement('div');
      slot.className = 'sort-slot';
      slot.setAttribute('data-slot-index', i);
      slot.setAttribute('aria-label', 'Ô thứ ' + (i + 1));
      slot.addEventListener('dragover', onSlotDragOver);
      slot.addEventListener('dragleave', onSlotDragLeave);
      slot.addEventListener('drop', onSlotDrop);
      sortSlotsEl.appendChild(slot);
    }

    sortPoolEl.innerHTML = '';
    shuffled.forEach(function (letter) {
      sortPoolEl.appendChild(createLetterSpan(letter, true));
    });
  }

  function cleanupSort() {
    removeCelebration();
    removeWrongEffect();
  }

  if (sortBtnNext) {
    sortBtnNext.addEventListener('click', function () {
      showSortGame();
    });
  }

  if (S.modeSort) {
    S.modeSort.addEventListener('click', function () {
      if (window.alphabetSetMode) window.alphabetSetMode('sort');
    });
  }

  if (sortPoolEl) {
    sortPoolEl.addEventListener('dragover', onPoolDragOver);
    sortPoolEl.addEventListener('drop', onPoolDrop);
  }

  if (!window.alphabetModes) window.alphabetModes = {};
  window.alphabetModes.sort = { show: showSortGame, cleanup: cleanupSort };
})();
