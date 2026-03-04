/**
 * Logic game Đếm và chọn số: câu hỏi (count + object), choices (đúng + sai xáo trộn), check answer, next.
 */
(function () {
  'use strict';

  var S = window.countMatchShared;
  if (!S) {
    console.error('countMatchShared chưa được load.');
    return;
  }

  var CHOICE_COUNT = 4; // 1 đúng + 3 sai

  var state = {
    mode: 'continuous', // 'continuous' | '5' | '10'
    currentQuestion: null, // { count, object, objectDisplay }
    choices: [],         // [3, 4, 5, 6] xáo trộn
    score: 0,
    totalRounds: 0,
    locked: false,
    roundOver: false
  };

  function setMode(mode) {
    if (mode === 'continuous' || mode === '5' || mode === '10') {
      state.mode = mode;
    }
  }

  /**
   * Tạo câu hỏi mới: getRandomQuestion, tạo choices = [correct, ...wrong], shuffle.
   */
  function nextQuestion() {
    state.locked = false;
    state.roundOver = false;
    var q = S.getRandomQuestion();
    state.currentQuestion = q;
    var wrongCount = Math.min(CHOICE_COUNT - 1, 3);
    var wrongs = S.getWrongOptions(q.count, wrongCount);
    state.choices = [q.count].concat(wrongs);
    state.choices = S.shuffle(state.choices);
    if (state.mode === '5' || state.mode === '10') {
      state.totalRounds += 1;
    }
  }

  /**
   * Xử lý khi bé chọn một số.
   * @param {number} value - giá trị nút (số)
   * @returns {{ correct: boolean, roundOver: boolean }}
   */
  function onChoiceClick(value) {
    if (state.locked) return { correct: false, roundOver: false };
    if (!state.currentQuestion) return { correct: false, roundOver: false };
    var correct = value === state.currentQuestion.count;
    if (correct) state.score += 1;
    var roundOver = false;
    if (state.mode === '5' || state.mode === '10') {
      var limit = state.mode === '5' ? 5 : 10;
      if (state.totalRounds >= limit) {
        state.roundOver = true;
        roundOver = true;
      }
    }
    if (correct || roundOver) state.locked = true;
    return { correct: correct, roundOver: roundOver };
  }

  function resetGame() {
    state.score = 0;
    state.totalRounds = 0;
    state.locked = false;
    state.roundOver = false;
    nextQuestion();
  }

  function isRoundOver() {
    return state.roundOver;
  }

  function getState() {
    return {
      mode: state.mode,
      currentQuestion: state.currentQuestion,
      choices: state.choices,
      score: state.score,
      totalRounds: state.totalRounds,
      locked: state.locked,
      roundOver: state.roundOver
    };
  }

  window.CountMatchGame = {
    setMode: setMode,
    nextQuestion: nextQuestion,
    onChoiceClick: onChoiceClick,
    resetGame: resetGame,
    isRoundOver: isRoundOver,
    getState: getState
  };
})();
