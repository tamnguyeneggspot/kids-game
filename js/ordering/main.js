/**
 * UI game Sắp xếp theo thứ tự: chọn chủ đề, render thẻ, gắn click theo thứ tự, Chơi lại / Chủ đề khác.
 */
(function () {
  'use strict';

  var S = window.orderingShared;
  var G = window.OrderingGame;
  if (!S || !G) return;

  var orderingCardsEl = document.getElementById('orderingCards');
  var orderingStatusEl = document.getElementById('orderingStatus');
  var btnReplay = document.getElementById('orderingBtnReplay');
  var btnTopic = document.getElementById('orderingBtnTopic');
  var topicBtns = document.querySelectorAll('.ordering-topic-btn');

  function setStatus(text, isSuccess) {
    if (!orderingStatusEl) return;
    orderingStatusEl.textContent = text;
    orderingStatusEl.classList.toggle('is-success', !!isSuccess);
  }

  function renderCards() {
    var st = G.getState();
    if (!orderingCardsEl) return;
    orderingCardsEl.innerHTML = '';
    var topic = st.topic;
    var prefix = S.getLabelPrefix(topic);
    var clickedValues = {};
    st.clickedOrder.forEach(function (item) {
      clickedValues[item.value] = true;
    });
    for (var i = 0; i < st.items.length; i++) {
      var item = st.items[i];
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'ordering-card';
      card.dataset.value = item.value;
      card.setAttribute('aria-label', prefix + item.label);
      if (clickedValues[item.value]) card.classList.add('correct');
      card.textContent = item.label;
      card.addEventListener('click', function () {
        onCardClick(this.dataset.value);
      });
      orderingCardsEl.appendChild(card);
    }
  }

  function onCardClick(value) {
    var result = G.onCardClick(value);
    if (result.correct) {
      if (window.webGameSfx) window.webGameSfx.playCorrect();
      renderCards();
      if (result.completed) {
        setStatus('Bé đã sắp xếp đúng!', true);
        if (window.webGameSfx) window.webGameSfx.playCorrect();
        if (btnReplay) btnReplay.focus();
      } else {
        setStatus('Tiếp tục click đúng thứ tự nhé!', false);
      }
    } else {
      if (window.webGameSfx) window.webGameSfx.playWrong();
      var cards = orderingCardsEl ? orderingCardsEl.querySelectorAll('.ordering-card') : [];
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].dataset.value === value) {
          cards[i].classList.add('wrong');
          setTimeout(function (el) {
            if (el) el.classList.remove('wrong');
          }, 500, cards[i]);
          break;
        }
      }
      setStatus('Chưa đúng thứ tự. Click từ bé đến lớn nhé!', false);
    }
  }

  function startGame(topic) {
    G.initGame(topic);
    setStatus('Click lần lượt theo thứ tự từ bé đến lớn (1 → 2 → … hoặc A → B → …).', false);
    renderCards();
  }

  function setActiveTopic(topic) {
    for (var t = 0; t < topicBtns.length; t++) {
      var b = topicBtns[t];
      if (b.dataset.topic === topic) {
        b.classList.add('active');
        b.setAttribute('aria-pressed', 'true');
      } else {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      }
    }
  }

  // Chọn chủ đề
  for (var i = 0; i < topicBtns.length; i++) {
    topicBtns[i].addEventListener('click', function () {
      var topic = this.dataset.topic;
      if (!topic) return;
      setActiveTopic(topic);
      startGame(topic);
    });
  }

  if (btnReplay) {
    btnReplay.addEventListener('click', function () {
      G.resetGame();
      startGame(G.getState().topic);
    });
  }

  if (btnTopic) {
    btnTopic.addEventListener('click', function () {
      var other = G.getState().topic === 'numbers' ? 'letters' : 'numbers';
      setActiveTopic(other);
      startGame(other);
    });
  }

  startGame('numbers');
})();
