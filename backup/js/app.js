/* =============================================
   亲亲家园 — 主应用逻辑
   SPA routing, Moments CRUD, English Games
   ============================================= */

(function () {
  'use strict';

 // ── State ──────────────────────────────────
 const STORAGE_KEY = 'qqjy_moments';
  const POINTS_KEY = 'qqjy_points';
  const BADGES_KEY = 'qqjy_badges';
  const LETTERS_KEY = 'qqjy_learned_letters';
 let moments = [];
  let totalPoints = 0;
  let earnedBadges = [];
  let learnedLetters = new Set();
 let currentGame = 'match';

  // ── DOM refs ───────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const mainEl = $('#app-main');
  const pages = { home: $('#page-home'), moments: $('#page-moments'), games: $('#page-games') };
  const navBtns = $$('.nav-btn');
  const timelineEl = $('#moments-timeline');
  const recentListEl = $('#recent-moments-list');
  const modalOverlay = $('#modal-overlay');
  const momentForm = $('#moment-form');
  const toastEl = $('#toast');
  const gameContainer = $('#game-container');
  const gameTabs = $$('.game-tab');
  const detailOverlay = $('#moment-detail-overlay');

 // ── Init ───────────────────────────────────
 function init() {
   loadMoments();
    loadGameState();
   renderRecent();
    bindNav();
    bindMoments();
    bindGames();
    bindModal();
    renderGame();
  }

 // ═══════════════════════════════════════════
  //  POINTS & REWARDS
  // ═══════════════════════════════════════════

  const REWARD_TIERS = [
    { threshold: 50,  name: '学习小星星', emoji: '⭐', color: '#FFD166' },
    { threshold: 100, name: '闪亮之星',   emoji: '🌟', color: '#FFD166' },
    { threshold: 200, name: '学习小达人', emoji: '🏆', color: '#06D6A0' },
    { threshold: 500, name: '英语小天才', emoji: '👑', color: '#B8A9E8' },
    { threshold: 1000,name: '英语大师',   emoji: '🎓', color: '#6CB4EE' },
  ];

  function loadGameState() {
    try {
      totalPoints = parseInt(localStorage.getItem(POINTS_KEY)) || 0;
      earnedBadges = JSON.parse(localStorage.getItem(BADGES_KEY)) || [];
      learnedLetters = new Set(JSON.parse(localStorage.getItem(LETTERS_KEY)) || []);
    } catch (e) {
      totalPoints = 0;
      earnedBadges = [];
      learnedLetters = new Set();
    }
  }

  function saveGameState() {
    localStorage.setItem(POINTS_KEY, totalPoints.toString());
    localStorage.setItem(BADGES_KEY, JSON.stringify(earnedBadges));
    localStorage.setItem(LETTERS_KEY, JSON.stringify([...learnedLetters]));
  }

  function addPoints(n) {
    const prevPoints = totalPoints;
    totalPoints += n;
    saveGameState();
    renderScoreBar();
    // Check for newly earned rewards
    for (const tier of REWARD_TIERS) {
      if (prevPoints < tier.threshold && totalPoints >= tier.threshold && !earnedBadges.includes(tier.name)) {
        earnedBadges.push(tier.name);
        saveGameState();
        showRewardPopup(tier);
        break;
      }
    }
  }

  function getNextReward() {
    for (const tier of REWARD_TIERS) {
      if (totalPoints < tier.threshold && !earnedBadges.includes(tier.name)) return tier;
    }
    return null;
  }

  function getCurrentLevel() {
    let level = null;
    for (const tier of REWARD_TIERS) {
      if (totalPoints >= tier.threshold) level = tier;
    }
    return level;
  }

  function renderScoreBar() {
    let bar = document.getElementById('score-bar');
    if (!bar) return;

    const nextReward = getNextReward();
    const currentLevel = getCurrentLevel();
    const progress = nextReward
      ? Math.min(100, Math.round((totalPoints / nextReward.threshold) * 100))
      : 100;

    bar.innerHTML = `
      <div class="score-info">
        <span class="score-level">${currentLevel ? currentLevel.emoji + ' ' + currentLevel.name : '🌱 初学小芽'}</span>
        <span class="score-points" id="score-points">⭐ ${totalPoints} 分</span>
      </div>
      ${nextReward ? `
      <div class="progress-track">
        <div class="progress-fill" style="width:${progress}%"></div>
        <span class="progress-label">距离 ${nextReward.emoji}${nextReward.name} 还需 ${nextReward.threshold - totalPoints} 分</span>
      </div>` : `
      <div class="progress-track complete">
        <div class="progress-fill" style="width:100%"></div>
        <span class="progress-label">🎉 已解锁全部奖励！</span>
      </div>`}
      ${earnedBadges.length > 0 ? `
      <div class="badge-row">
        ${earnedBadges.map(name => {
          const tier = REWARD_TIERS.find(t => t.name === name);
          return tier ? `<span class="badge" style="background:${tier.color}20; border-color:${tier.color}" title="${tier.name}">${tier.emoji}</span>` : '';
        }).join('')}
      </div>` : ''}
    `;
  }

  function showRewardPopup(tier) {
    const overlay = document.createElement('div');
    overlay.className = 'reward-overlay';
    overlay.innerHTML = `
      <div class="reward-popup">
        <div class="reward-badge-large">${tier.emoji}</div>
        <h2>恭喜获得新奖励！</h2>
        <p class="reward-name">${tier.name}</p>
        <p class="reward-desc">你已经积累了 <strong>${totalPoints} 分</strong>，继续加油！</p>
        <button class="btn-primary reward-close">太棒了！</button>
      </div>
    `;
    document.body.appendChild(overlay);

    createConfetti();

    overlay.querySelector('.reward-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }

  // ═══════════════════════════════════════════
 //  NAVIGATION
 // ═══════════════════════════════════════════

  function bindNav() {
    navBtns.forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.nav)));
    // Also bind clicks on elements with data-nav attribute
    document.addEventListener('click', (e) => {
      const navEl = e.target.closest('[data-nav]');
      if (navEl && !navEl.classList.contains('nav-btn')) {
        navigate(navEl.dataset.nav);
      }
    });
  }

  function navigate(page) {
    Object.values(pages).forEach(p => p.classList.remove('active'));
    navBtns.forEach(b => b.classList.remove('active'));

    const targetPage = pages[page];
    if (targetPage) targetPage.classList.add('active');

    const activeNav = document.querySelector(`.nav-btn[data-nav="${page}"]`);
    if (activeNav) activeNav.classList.add('active');

    if (page === 'moments') renderTimeline();
    if (page === 'games') renderGame();
    if (page === 'home') renderRecent();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ═══════════════════════════════════════════
  //  DATA PERSISTENCE
  // ═══════════════════════════════════════════

  function loadMoments() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      moments = raw ? JSON.parse(raw) : [];
    } catch (e) {
      moments = [];
    }
    moments.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function saveMoments() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(moments));
  }

  function addMoment(moment) {
    moment.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    moment.createdAt = new Date().toISOString();
    moments.unshift(moment);
    saveMoments();
  }

  function deleteMoment(id) {
    moments = moments.filter(m => m.id !== id);
    saveMoments();
  }

  // ═══════════════════════════════════════════
  //  MOMENTS — RENDER
  // ═══════════════════════════════════════════

  function createMomentCard(m, compact) {
    const div = document.createElement('div');
    div.className = 'moment-card';
    div.dataset.id = m.id;

    const imgHtml = m.image
      ? `<img class="moment-image" src="${escapeHtml(m.image)}" alt="${escapeHtml(m.title)}" loading="lazy">`
      : '';

    const dateStr = formatDate(m.date);

    div.innerHTML = `
      ${imgHtml}
      <div class="moment-body">
        <div class="moment-date">${dateStr}</div>
        <div class="moment-title">${escapeHtml(m.title)}</div>
        ${m.content ? `<div class="moment-content">${escapeHtml(m.content)}</div>` : ''}
      </div>
      ${compact ? '' : `
      <div class="moment-actions">
        <button class="btn-icon" data-action="view" title="查看详情">👁️</button>
        <button class="btn-icon danger" data-action="delete" title="删除">🗑️</button>
      </div>`}
    `;

    // Click on card body to view detail
    if (!compact) {
      div.querySelector('.moment-body').addEventListener('click', () => showDetail(m));
    } else {
      div.addEventListener('click', () => showDetail(m));
    }

    // Action buttons
    div.querySelector('[data-action="view"]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      showDetail(m);
    });
    div.querySelector('[data-action="delete"]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('确定要删除这个美好瞬间吗？')) {
        deleteMoment(m.id);
        toast('已删除', 'error');
        renderTimeline();
        renderRecent();
      }
    });

    return div;
  }

  function renderTimeline() {
    if (!timelineEl) return;
    timelineEl.innerHTML = '';

    if (moments.length === 0) {
      timelineEl.innerHTML = '<p class="empty-hint">还没有任何记录，点击「记录瞬间」开始吧 ✨</p>';
      return;
    }

    moments.forEach(m => timelineEl.appendChild(createMomentCard(m, false)));
  }

  function renderRecent() {
    if (!recentListEl) return;
    recentListEl.innerHTML = '';

    const recent = moments.slice(0, 6);
    if (recent.length === 0) {
      recentListEl.innerHTML = '<p class="empty-hint">还没有记录，快去记录第一个美好瞬间吧 ✨</p>';
      return;
    }

    recent.forEach(m => recentListEl.appendChild(createMomentCard(m, true)));
  }

  function showDetail(m) {
    // Ensure detail overlay exists
    let overlay = $('#moment-detail-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'moment-detail-overlay';
      overlay.className = 'moment-detail-overlay';
      document.body.appendChild(overlay);
    }

    const dateStr = formatDate(m.date);
    overlay.innerHTML = `
      <div class="moment-detail">
        <button class="detail-close">&times;</button>
        ${m.image ? `<img src="${escapeHtml(m.image)}" alt="${escapeHtml(m.title)}">` : ''}
        <div class="detail-body">
          <div class="detail-date">${dateStr}</div>
          <div class="detail-title">${escapeHtml(m.title)}</div>
          ${m.content ? `<div class="detail-content">${escapeHtml(m.content)}</div>` : ''}
        </div>
      </div>
    `;
    overlay.classList.add('open');

    overlay.querySelector('.detail-close').addEventListener('click', () => overlay.classList.remove('open'));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  }

  // ═══════════════════════════════════════════
  //  MOMENTS — MODAL
  // ═══════════════════════════════════════════

  function bindMoments() {
    const addBtn = $('#btn-add-moment');
    if (addBtn) addBtn.addEventListener('click', openModal);
  }

  function bindModal() {
    $('#modal-close').addEventListener('click', closeModal);
    $('#btn-cancel').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    momentForm.addEventListener('submit', handleSubmit);

    // Image preview
    const imgInput = $('#moment-image');
    imgInput.addEventListener('change', () => {
      const preview = $('#image-preview');
      preview.innerHTML = '';
      const file = imgInput.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast('照片大小不能超过 5MB', 'error');
        imgInput.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        preview.innerHTML = `<img src="${reader.result}" alt="预览">`;
      };
      reader.readAsDataURL(file);
    });
  }

  function openModal() {
    momentForm.reset();
    $('#image-preview').innerHTML = '';
    $('#moment-date').value = new Date().toISOString().split('T')[0];
    modalOverlay.classList.add('open');
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    momentForm.reset();
    $('#image-preview').innerHTML = '';
  }

  function handleSubmit(e) {
    e.preventDefault();

    const title = $('#moment-title').value.trim();
    const date = $('#moment-date').value;
    const content = $('#moment-content').value.trim();

    if (!title) { toast('请输入标题', 'error'); return; }
    if (!date) { toast('请选择日期', 'error'); return; }

    const image = $('#image-preview img')?.src || '';

    addMoment({ title, date, content, image });
    closeModal();
    toast('美好瞬间已记录 ✨', 'success');
    renderTimeline();
    renderRecent();
  }

  // ═══════════════════════════════════════════
  //  GAMES
  // ═══════════════════════════════════════════

  // ── Game Data ──────────────────────────────

  const wordBank = [
    { word: 'cat', emoji: '🐱' },
    { word: 'dog', emoji: '🐶' },
    { word: 'fish', emoji: '🐟' },
    { word: 'bird', emoji: '🐦' },
    { word: 'bear', emoji: '🐻' },
    { word: 'lion', emoji: '🦁' },
    { word: 'apple', emoji: '🍎' },
    { word: 'banana', emoji: '🍌' },
    { word: 'orange', emoji: '🍊' },
    { word: 'grape', emoji: '🍇' },
    { word: 'sun', emoji: '☀️' },
    { word: 'moon', emoji: '🌙' },
    { word: 'star', emoji: '⭐' },
    { word: 'heart', emoji: '❤️' },
    { word: 'flower', emoji: '🌸' },
    { word: 'tree', emoji: '🌳' },
    { word: 'car', emoji: '🚗' },
    { word: 'book', emoji: '📖' },
    { word: 'cake', emoji: '🎂' },
    { word: 'ball', emoji: '⚽' },
    { word: 'house', emoji: '🏠' },
    { word: 'rain', emoji: '🌧️' },
    { word: 'milk', emoji: '🥛' },
    { word: 'egg', emoji: '🥚' },
    { word: 'bed', emoji: '🛏️' },
    { word: 'hat', emoji: '🎩' },
    { word: 'pig', emoji: '🐷' },
    { word: 'cow', emoji: '🐮' },
    { word: 'frog', emoji: '🐸' },
    { word: 'monkey', emoji: '🐵' },
  ];

  const alphabetBank = {
    A: { word: 'Apple', emoji: '🍎' },
    B: { word: 'Bear', emoji: '🐻' },
    C: { word: 'Cat', emoji: '🐱' },
    D: { word: 'Dog', emoji: '🐶' },
    E: { word: 'Egg', emoji: '🥚' },
    F: { word: 'Fish', emoji: '🐟' },
    G: { word: 'Grape', emoji: '🍇' },
    H: { word: 'Heart', emoji: '❤️' },
    I: { word: 'Ice', emoji: '🧊' },
    J: { word: 'Juice', emoji: '🧃' },
    K: { word: 'King', emoji: '👑' },
    L: { word: 'Lion', emoji: '🦁' },
    M: { word: 'Moon', emoji: '🌙' },
    N: { word: 'Nose', emoji: '👃' },
    O: { word: 'Orange', emoji: '🍊' },
    P: { word: 'Pig', emoji: '🐷' },
    Q: { word: 'Queen', emoji: '👸' },
    R: { word: 'Rain', emoji: '🌧️' },
    S: { word: 'Sun', emoji: '☀️' },
    T: { word: 'Tree', emoji: '🌳' },
    U: { word: 'Umbrella', emoji: '☂️' },
    V: { word: 'Van', emoji: '🚐' },
    W: { word: 'Water', emoji: '💧' },
    X: { word: 'Fox', emoji: '🦊' },
    Y: { word: 'Yellow', emoji: '💛' },
    Z: { word: 'Zebra', emoji: '🦓' },
  };

  // ── Game Bindings ──────────────────────────

  function bindGames() {
    gameTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        currentGame = tab.dataset.game;
        gameTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderGame();
      });
    });
  }

 function renderGame() {
    renderScoreBar();
   if (currentGame === 'match') renderMatchGame();
    else if (currentGame === 'alphabet') renderAlphabetGame();
    else if (currentGame === 'quiz') renderQuizGame();
  }

  // ── Game 1: Word Match ─────────────────────

  function renderMatchGame() {
    // Pick 6 random words
    const shuffled = [...wordBank].sort(() => Math.random() - 0.5);
    const round = shuffled.slice(0, 6);

    // Create emoji cards + word cards
    const emojiCards = round.map((item, i) => ({ type: 'emoji', ...item, pairId: i }));
    const wordCards = round.map((item, i) => ({ type: 'word', ...item, pairId: i }));

    // Shuffle all cards together
    const allCards = [...emojiCards, ...wordCards].sort(() => Math.random() - 0.5);

    gameContainer.innerHTML = `
      <div class="match-area" id="match-area"></div>
    `;

    const area = $('#match-area');
    let selected = null;
    let matchedCount = 0;

    allCards.forEach((card, idx) => {
      const el = document.createElement('div');
      el.className = 'match-card';
      el.dataset.pairId = card.pairId;
      el.dataset.type = card.type;
      el.dataset.index = idx;

      if (card.type === 'emoji') {
        el.innerHTML = `<span class="match-emoji">${card.emoji}</span>`;
      } else {
        el.innerHTML = `<span class="match-word">${card.word}</span>`;
      }

      el.addEventListener('click', () => {
        if (el.classList.contains('matched')) return;

        if (!selected) {
          // First selection
          el.classList.add('selected');
          selected = el;
        } else if (selected === el) {
          // Deselect
          el.classList.remove('selected');
          selected = null;
        } else {
          // Second selection — check match
          const id1 = selected.dataset.pairId;
          const id2 = el.dataset.pairId;
          const type1 = selected.dataset.type;
          const type2 = el.dataset.type;

          if (id1 === id2 && type1 !== type2) {
            // Correct match
            selected.classList.add('matched');
            selected.classList.add('correct-pop');
            el.classList.add('matched');
            el.classList.add('correct-pop');
            matchedCount++;

           const cardData = round[id1];
           speakWord(cardData.word);
            addPoints(10);

           if (matchedCount === 6) {
              setTimeout(() => celebrate('太棒了！全部配对成功！🎉'), 300);
           }
          } else {
            // Wrong match
            selected.classList.add('wrong');
            el.classList.add('wrong');
            setTimeout(() => {
              selected.classList.remove('wrong');
              el.classList.remove('wrong');
            }, 500);
          }

          selected.classList.remove('selected');
          selected = null;
        }
      });

      area.appendChild(el);
    });

    // Restart button
    const restartBtn = document.createElement('button');
    restartBtn.className = 'btn-next';
    restartBtn.textContent = '🔄 换一批';
    restartBtn.style.display = 'block';
    restartBtn.style.margin = '0 auto';
    restartBtn.addEventListener('click', renderMatchGame);
    gameContainer.appendChild(restartBtn);
  }

  // ── Game 2: Alphabet ──────────────────────

  function renderAlphabetGame() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    gameContainer.innerHTML = `
      <div class="alphabet-grid" id="alphabet-grid"></div>
      <div class="alphabet-display" id="alphabet-display">
        <p class="alphabet-placeholder">👆 点击字母开始学习吧！</p>
      </div>
    `;

    const grid = $('#alphabet-grid');
    const display = $('#alphabet-display');

    for (const letter of letters) {
      const btn = document.createElement('button');
      btn.className = 'alphabet-btn';
      btn.textContent = letter;
     btn.addEventListener('click', () => {
       document.querySelectorAll('.alphabet-btn').forEach(b => b.classList.remove('active'));
       btn.classList.add('active');

        const item = alphabetBank[letter];
        display.innerHTML = `
          <span class="big-emoji">${item.emoji}</span>
          <span class="big-word">${item.word}</span>
          <span class="big-letter">${letter} is for ${item.word}</span>
          <button class="speak-btn">🔊 听发音</button>
        `;
       display.querySelector('.speak-btn').addEventListener('click', () => speakWord(item.word));

       speakWord(item.word);

        // Award points for first-time letter learning
        if (!learnedLetters.has(letter)) {
          learnedLetters.add(letter);
          saveGameState();
          addPoints(2);
        }
     });
      grid.appendChild(btn);
    }
  }

  // ── Game 3: Picture Quiz ──────────────────

  function renderQuizGame() {
    const item = wordBank[Math.floor(Math.random() * wordBank.length)];

    // Pick 3 options (including correct one)
    const options = new Set([item.word]);
    const pool = wordBank.filter(w => w.word !== item.word).sort(() => Math.random() - 0.5);
    for (const w of pool) {
      if (options.size >= 3) break;
      options.add(w.word);
    }
    const optionList = [...options].sort(() => Math.random() - 0.5);

    gameContainer.innerHTML = `
      <div class="quiz-area" id="quiz-area">
        <span class="quiz-emoji">${item.emoji}</span>
        <p class="quiz-question">这是什么？点击正确的英文单词吧！</p>
        <div class="quiz-options" id="quiz-options"></div>
      </div>
    `;

    const optionsEl = $('#quiz-options');
    let answered = false;

    optionList.forEach(word => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = word;
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;

       if (word === item.word) {
         btn.classList.add('correct');
         speakWord(item.word);
          addPoints(10);
          setTimeout(() => celebrate('答对啦！真聪明！🌟'), 200);
        } else {
          btn.classList.add('wrong');
          // Highlight correct answer
          optionsEl.querySelectorAll('.quiz-option').forEach(b => {
            if (b.textContent === item.word) {
              setTimeout(() => b.classList.add('correct'), 500);
            }
          });
        }

        // Next button
        setTimeout(() => {
          const nextBtn = document.createElement('button');
          nextBtn.className = 'btn-next';
          nextBtn.textContent = '👉 下一题';
          nextBtn.addEventListener('click', renderQuizGame);
          optionsEl.after(nextBtn);
        }, 1200);
      });
      optionsEl.appendChild(btn);
    });
  }

  // ═══════════════════════════════════════════
  //  UTILITIES
  // ═══════════════════════════════════════════

  function speakWord(word) {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  function celebrate(msg) {
    createConfetti();
    toast(msg, 'success');
  }

  function createConfetti() {
    const el = document.createElement('div');
    el.className = 'celebration';
    const emojis = ['🎉', '⭐', '🌟', '💫', '✨', '🎊', '💖', '🌈'];

    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('span');
      confetti.className = 'confetti';
      confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = -(Math.random() * 20 + 5) + '%';
      confetti.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
      confetti.style.animationDelay = Math.random() * 0.8 + 's';
      el.appendChild(confetti);
    }

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  function toast(msg, type) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.className = 'toast ' + (type || '');
    toastEl.classList.add('show');
    clearTimeout(toastEl._timeout);
    toastEl._timeout = setTimeout(() => toastEl.classList.remove('show'), 2500);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Start ──────────────────────────────────
  init();

})();
