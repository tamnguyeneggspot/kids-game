/**
 * Logic game Sắp xếp theo thứ tự: init items (shuffle), click theo thứ tự, check hoàn thành.
 */
(function () {
  'use strict';

  var S = window.orderingShared;
  if (!S) {
    console.error('orderingShared chưa được load.');
    return;
  }

  var state = {
    topic: 'numbers',
    items: [],       // mảng item đã shuffle (để render thẻ)
    correctOrder: [], // thứ tự đúng (getTopicData(topic))
    clickedOrder: [], // thứ tự bé đã click (các item đã chọn đúng)
    nextIndex: 0,    // index tiếp theo cần click (0 = click item đầu tiên trong thứ tự chuẩn)
    locked: false,
    completed: false
  };

  /**
   * Khởi tạo game theo chủ đề.
   * @param {string} topic - 'numbers' | 'letters'
   */
  function initGame(topic) {
    if (!S.TOPICS[topic]) topic = 'numbers';
    state.topic = topic;
    state.locked = false;
    state.completed = false;
    state.correctOrder = S.getTopicData(topic);
    state.items = S.shuffle(state.correctOrder);
    state.clickedOrder = [];
    state.nextIndex = 0;
  }

  /**
   * Xử lý khi bé click một thẻ (chế độ click theo thứ tự).
   * Bé phải click đúng thứ tự: đầu tiên click item đứng đầu (1 hoặc A), rồi 2, rồi 3...
   * @param {string} value - value của item vừa click
   * @returns {{ correct: boolean, completed: boolean }}
   */
  function onCardClick(value) {
    if (state.locked || state.completed) return { correct: false, completed: false };
    var expected = state.correctOrder[state.nextIndex];
    if (!expected || expected.value !== value) {
      return { correct: false, completed: false };
    }
    state.clickedOrder.push(expected);
    state.nextIndex += 1;
    var completed = state.nextIndex >= state.correctOrder.length;
    if (completed) {
      state.completed = true;
      state.locked = true;
    }
    return { correct: true, completed: completed };
  }

  /**
   * Kiểm tra đã hoàn thành chưa (tất cả đã click đúng thứ tự).
   */
  function isCompleted() {
    return state.completed;
  }

  /**
   * Reset và shuffle lại (giữ nguyên chủ đề).
   */
  function resetGame() {
    state.locked = false;
    state.completed = false;
    state.items = S.shuffle(state.correctOrder);
    state.clickedOrder = [];
    state.nextIndex = 0;
  }

  function getState() {
    return {
      topic: state.topic,
      items: state.items.slice(),
      correctOrder: state.correctOrder.slice(),
      clickedOrder: state.clickedOrder.slice(),
      nextIndex: state.nextIndex,
      locked: state.locked,
      completed: state.completed
    };
  }

  window.OrderingGame = {
    initGame: initGame,
    onCardClick: onCardClick,
    isCompleted: isCompleted,
    resetGame: resetGame,
    getState: getState
  };
})();
