/**
 * Logic game Nghe và chọn: chọn item ngẫu nhiên, tạo choices, kiểm tra đúng/sai, sang câu tiếp.
 */
(function () {
  'use strict';

  var S = window.listenTapShared;
  if (!S) {
    console.error('listenTapShared chưa được load.');
    return;
  }

  var CHOICE_COUNT = 4; // 1 đúng + 3 sai (có thể 3 nếu ít phần tử)

  var state = {
    topic: 'alphabet',
    mode: 'continuous', // 'continuous' | '5' | '10'
    currentItem: null,
    choices: [],
    score: 0,
    totalRounds: 0,
    locked: false,
    roundOver: false
  };

  /**
   * Cập nhật topic hoặc mode (gọi từ main khi user đổi tab).
   */
  function setTopic(topic) {
    if (S.TOPICS[topic]) state.topic = topic;
  }

  function setMode(mode) {
    state.mode = mode;
  }

  /**
   * Tạo câu hỏi mới: chọn item đúng, thêm lựa chọn sai, xáo trộn.
   */
  function nextQuestion() {
    state.locked = false;
    state.roundOver = false;
    var data = S.getTopicData(state.topic);
    if (!data.length) {
      state.currentItem = null;
      state.choices = [];
      return;
    }
    var correct = S.getRandomItem(data, null);
    state.currentItem = correct;
    var wrongCount = Math.min(CHOICE_COUNT - 1, data.length - 1);
    var wrongs = S.getWrongChoices(correct, state.topic, wrongCount);
    state.choices = [correct].concat(wrongs);
    state.choices = S.shuffle(state.choices);
    if (state.mode === '5' || state.mode === '10') {
      state.totalRounds += 1;
    }
  }

  /**
   * Xử lý khi bé chọn một ô.
   * @param {number} index - chỉ số trong state.choices
   * @returns {{ correct: boolean, roundOver: boolean }} correct và (nếu chế độ 5/10) roundOver
   */
  function onChoiceClick(index) {
    if (state.locked) return { correct: false, roundOver: false };
    if (index < 0 || index >= state.choices.length) return { correct: false, roundOver: false };
    var chosen = state.choices[index];
    var correct = chosen && state.currentItem && chosen.value === state.currentItem.value;
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

  /**
   * Reset và bắt đầu lại (chế độ mới câu đầu).
   */
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
      topic: state.topic,
      mode: state.mode,
      currentItem: state.currentItem,
      choices: state.choices,
      score: state.score,
      totalRounds: state.totalRounds,
      locked: state.locked,
      roundOver: state.roundOver
    };
  }

  window.ListenTapGame = {
    setTopic: setTopic,
    setMode: setMode,
    nextQuestion: nextQuestion,
    onChoiceClick: onChoiceClick,
    resetGame: resetGame,
    isRoundOver: isRoundOver,
    getState: getState
  };
})();
