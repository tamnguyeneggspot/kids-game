/**
 * Logic game Tìm cái giống / khác: build câu (mẫu + choices), check answer, next.
 */
(function () {
  'use strict';

  var S = window.sameDifferentShared;
  if (!S) {
    console.error('sameDifferentShared chưa được load.');
    return;
  }

  var state = {
    mode: 'same',       // 'same' | 'different'
    topic: 'alphabet',
    roundsMode: 'continuous', // 'continuous' | '5' | '10'
    sample: null,       // thẻ mẫu (chỉ chế độ same)
    choices: [],
    correctIndex: 0,    // index đáp án đúng trong choices
    score: 0,
    totalRounds: 0,
    locked: false,
    roundOver: false
  };

  function setMode(mode) {
    if (mode === 'same' || mode === 'different') state.mode = mode;
  }

  function setTopic(topic) {
    if (S.TOPICS[topic]) state.topic = topic;
  }

  function setRoundsMode(rounds) {
    state.roundsMode = rounds;
  }

  /**
   * Tạo câu hỏi mới: gọi getSameQuestion hoặc getDifferentQuestion, shuffle, lưu correctIndex.
   */
  function nextQuestion() {
    state.locked = false;
    state.roundOver = false;
    if (state.mode === 'same') {
      var sameQ = S.getSameQuestion(state.topic);
      state.sample = sameQ.sample;
      state.choices = sameQ.choices || [];
      state.correctIndex = -1;
      if (state.sample && state.choices.length) {
        for (var i = 0; i < state.choices.length; i++) {
          if (state.choices[i].value === state.sample.value) {
            state.correctIndex = i;
            break;
          }
        }
        if (state.correctIndex === -1) state.correctIndex = 0;
      }
    } else {
      var diffQ = S.getDifferentQuestion(state.topic);
      state.sample = null;
      state.choices = diffQ.choices || [];
      state.correctIndex = diffQ.correctIndex !== undefined ? diffQ.correctIndex : 0;
    }
    if (state.roundsMode === '5' || state.roundsMode === '10') {
      state.totalRounds += 1;
    }
  }

  /**
   * Xử lý khi bé click một thẻ.
   * @param {number} index - chỉ số trong state.choices
   * @returns {{ correct: boolean, roundOver: boolean }}
   */
  function onCardClick(index) {
    if (state.locked) return { correct: false, roundOver: false };
    if (index < 0 || index >= state.choices.length) return { correct: false, roundOver: false };
    var correct = index === state.correctIndex;
    if (correct) state.score += 1;
    var roundOver = false;
    if (state.roundsMode === '5' || state.roundsMode === '10') {
      var limit = state.roundsMode === '5' ? 5 : 10;
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
      topic: state.topic,
      roundsMode: state.roundsMode,
      sample: state.sample,
      choices: state.choices,
      correctIndex: state.correctIndex,
      score: state.score,
      totalRounds: state.totalRounds,
      locked: state.locked,
      roundOver: state.roundOver
    };
  }

  window.SameDifferentGame = {
    setMode: setMode,
    setTopic: setTopic,
    setRoundsMode: setRoundsMode,
    nextQuestion: nextQuestion,
    onCardClick: onCardClick,
    resetGame: resetGame,
    isRoundOver: isRoundOver,
    getState: getState
  };
})();
